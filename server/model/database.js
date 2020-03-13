const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 2,
		max: 15,
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 15,
	},
});

const User = mongoose.model('User', userSchema, 'users');

const messageSchema = new mongoose.Schema({
	roomName: {
		type: String,
		required: true,
	},
	userName: {
		type: String,
		required: true,
		min: 2,
		max: 15,
	},
	message: {
		type: String,
		required: true,
	}
});

const Message = mongoose.model('Message', messageSchema, 'messages');

module.exports = {
	User: User,
	Message: Message,
}