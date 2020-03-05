const express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const testRouter = require('./router');

server.listen(8080);

let rooms = [
    {
        id: 1,
        name: "room 1",
        users: [],
        messages: [],
    },
    {
        id: 2,
        name: "room 2",
        users: [],
        messages: [],
    },
    {
        id: 3,
        name: "room 3",
        users: [],
        messages: [],
    },
    {
        id: 4,
        name: "room 4",
        users: [],
        messages: [],
    }
];

app.use(express.static("dist"));


io.on('connection', function(socket) {
    console.log(`${new Date()} New connection established: ${socket.id}`);
    socket.user = {};

    function disconnectUser() {
        let room = rooms[socket.user.roomId];
        if(room) {
            room.users.splice(room.users.indexOf(socket.user), 1);
            socket.user.roomId = -1;
            io.in(room.name).emit('room-users', room.users);
            console.log(`--${socket.user.name} has left ${room.name}`);
        }
    }

    socket.on('disconnect', function() {
        disconnectUser();
    });

    socket.on('join-room', user => {
        let roomFound = rooms.find(room => room.name === user.selectedRoom);
        if(roomFound) {
            socket.join(user.selectedRoom, () => {
                socket.user = {
                    id: socket.id,
                    name: user.name,
                    roomId: rooms.indexOf(roomFound),
                }
                roomFound.users.push(socket.user);
                socket.emit('connected', {result: true, name: user.selectedRoom, messages: roomFound.messages});
                io.in(roomFound.name).emit('room-users', roomFound.users);
                console.log(`--${user.name} has joined ${user.selectedRoom}`);
            });
        }
    });

    socket.on('leave-room', () => {
        let room = rooms[socket.user.roomId];
        if(!room) {
            return;
        }
        socket.leave(room.name, (err) => {
            if(err) {
                console.log(err);
            } else {
                disconnectUser();
            }
        });
    });

    socket.on('change-username', username => {
        socket.user.name = username;
        let room = rooms[socket.user.roomId];
        if(room) {
            io.to(room.name).emit('room-users', room.users);
        }
    });
    
    socket.on('message', msg => {
        if(socket.user.roomId != -1) {
            console.log(socket.user.name + ': ' + msg);
            let p = {
                username: socket.user.name,
                message: msg,
            }
            rooms[socket.user.roomId].messages.push(p);
            io.to(rooms[socket.user.roomId].name).emit('message', p);
        }
    });

    socket.emit('room-list', rooms.map(({name}) => name));
});