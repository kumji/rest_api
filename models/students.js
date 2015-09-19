var mongoose = require('mongoose');


var studentSchema = new mongoose.Schema({
	name: String,
	email: String,
	age: Number,
	score: { type: Number, min: 1 }
});

module.exports = mongoose.model('Student', studentSchema);