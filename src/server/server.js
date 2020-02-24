const socketIO = require('socket.io');

const PORT = 8080;

const io = socketIO(PORT);

let rooms = [
    {
        id: 1,
        name: "Silvermoon",
        users: [],
        messages: [],
    },
    {
        id: 2,
        name: "Orgrimmar",
        users: [],
        messages: [],
    },
    {
        id: 3,
        name: "Dalaran",
        users: [],
        messages: [],
    },
    {
        id: 4,
        name: "Ironforge",
        users: [],
        messages: [],
    }
];

let allUsers = [];

io.on('connection', function(socket) {
    console.log(`${new Date()} New connection established: ${socket.id}`);
    socket.user = {};
    allUsers.push(socket);

    function disconnectUser() {
        let room = rooms[socket.user.roomId];
        if(room) {
            room.users.splice(room.users.indexOf(socket.user), 1);
            socket.user.roomId = -1;
            io.to(room.name).emit('room-users', room.users);
            console.log(`--${socket.user.name} has left ${room.name}`);
        }
    }

    socket.on('disconnect', function() {
        disconnectUser();
    });
 
    socket.on('join-room', user => {
        let roomFound = rooms.find(room => room.name === user.selectedRoom);
        if(roomFound) {
            socket.join(user.selectedRoom);
            socket.user = {
                name: user.name,
                roomId: rooms.indexOf(roomFound),
            }
            roomFound.users.push(socket.user);
            socket.emit('connected', {result: true, name: user.selectedRoom, messages: roomFound.messages});
            io.to(roomFound.name).emit('room-users', roomFound.users);
            console.log(`--${user.name} has joined ${user.selectedRoom}`);
        }
    });

    socket.on('leave-room', () => {
        socket.leave(socket.user.selectedRoom);
        disconnectUser();
    });

    socket.on('change-username', username => {
        socket.user.name = username;
        let room = rooms[socket.user.roomId];
        if(room) {
            io.to(room.name).emit('room-users', room.users);
            console.log(room.name, room.users);
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
        console.log(rooms);
    });

    socket.emit('room-list', rooms.map(({name}) => name));
});

console.log(`Server listening port ${PORT}`);