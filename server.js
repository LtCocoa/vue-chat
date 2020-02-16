const socketIO = require('socket.io');

const PORT = 8080;

const io = socketIO(PORT);

let number = 0;

io.on('connection', function(socket) {
    console.log('New connection established');

    socket.emit('pushNumber', number);

    socket.on('onNumberChange', function(num) {
        number++;
        socket.emit('pushNumber', number);
    });
});

console.log(`Server listening port ${PORT}`);