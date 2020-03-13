const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User, Message } = require('./model/database');

const result = dotenv.config();

app.use(express.json());

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });

let rooms = [
	{
		id: 1,
		name: "room 1",
		users: [],
	},
	{
		id: 2,
		name: "room 2",
		users: [],
	},
	{
		id: 3,
		name: "room 3",
		users: [],
	},
	{
		id: 4,
		name: "room 4",
		users: [],
	}
];

const corsOptions = {
	exposedHeaders: 'auth-token',
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {

	next();
});

app.use(express.static("client/dist"));

app.post('/login', (req, res) => {
	User.findOne({
		name: req.body.name,
		password: req.body.password,
	})
		.then((user) => {
			if (user) {
				const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
				res.header('auth-token', token);
				res.send({
					result: "ok",
					name: user.name,
				});
			} else {
				//User not found
				res.send({
					result: "error",
					message: "User not found",
				})
			}
		})
		.catch((err) => {
			console.log(err);
		});
});

app.post('/register', (req, res) => {
	const newUser = new User({
		name: req.body.name,
		password: req.body.password,
	});

	User.findOne({
		name: newUser.name,
	})
		.then((data) => {
			if (data) {
				res.send({
					result: "error",
					message: "User already exists",
				});
			} else {
				newUser.save()
					.then(() => {
						res.send({
							result: "ok",
							message: "User registered",
						});
					})
					.catch((err) => {

					})
			}
		});
});

app.get('/auth', (req, res) => {
	const token = req.headers["auth-token"];
	try {
		const userId = jwt.verify(token, process.env.TOKEN_SECRET);

		User.findById(userId)
			.then((user) => {
				if (user) {
					res.send(user.name);
				}
			});
	} catch (err) {
		console.log(err);
	}
});

io.on('connection', function (socket) {
	console.log(`${new Date()} New connection established: ${socket.id}`);
	socket.user = {};

	function disconnectUser() {
		let room = rooms[socket.user.roomId];
		if (room) {
			room.users.splice(room.users.indexOf(socket.user), 1);
			socket.user.roomId = -1;
			io.in(room.name).emit('room-users', room.users);
			console.log(`--${socket.user.name} has left ${room.name}`);
		}
	}

	socket.on('disconnect', function () {
		disconnectUser();
	});

	socket.on('join-room', user => {
		let roomFound = rooms.find(room => room.name === user.selectedRoom);
		if (roomFound) {
			socket.join(user.selectedRoom, () => {
				socket.user = {
					id: socket.id,
					name: user.name,
					roomId: rooms.indexOf(roomFound),
				}
				roomFound.users.push(socket.user);
				Message.find({ roomName: roomFound.name }, { roomName: 0, _id: 0, __v: 0 })
					.then((data) => {
						socket.emit('connected', { result: true, name: user.selectedRoom, messages: data });
					});
				io.in(roomFound.name).emit('room-users', roomFound.users);
				console.log(`--${user.name} has joined ${user.selectedRoom}`);
			});
		}
	});

	socket.on('leave-room', () => {
		let room = rooms[socket.user.roomId];
		if (!room) {
			return;
		}
		socket.leave(room.name, (err) => {
			if (err) {
				console.log(err);
			} else {
				disconnectUser();
			}
		});
	});

	socket.on('change-username', username => {
		const room = rooms[socket.user.roomId];
		socket.user.name = username;
		if (room) {
			io.to(room.name).emit('room-users', room.users);
		}
	});

	socket.on('message', msg => {
		const room = rooms[socket.user.roomId];

		if (socket.user.roomId != -1) {
			const dbMsg = new Message({
				roomName: room.name,
				userName: socket.user.name,
				message: msg
			});

			dbMsg.save().catch((err) => console.log(err));

			io.to(room.name)
				.emit('message', {
					userName: socket.user.name,
					message: msg
				});
		}
	});

	socket.emit('room-list', rooms.map(({ name }) => name));
});

server.listen(8080);