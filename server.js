const socketIO = require('socket.io');

const PORT = 8080;

const io = socketIO(PORT);

let messages = [];

io.on('connection', function(socket) {
    console.log('New connection established');

    io.emit('allMessages', messages);

    socket.on('newMessage', function(msg) {
        messages.push(msg);
        io.emit('newMessage', msg);
    });

    socket.on('clearMessages', () => {
        messages = [];
        io.emit('allMessages', messages);
    })
});

console.log(`Server listening port ${PORT}`);