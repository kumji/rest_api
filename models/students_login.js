var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var eat = require('eat');

var loginSchema = new mongoose.Schema({
	email: String,
	basic: {
		email: String,
		password: String
	}
});


loginSchema.methods.generateHash = function(password, callback) {
	bcrypt.hash(password, 8, function(err, hash){
		if(err) return callback(err);
		this.basic.password = hash;
		callback(null, hash);
	}.bind(this));
};

loginSchema.methods.compareHash = function(password, callback) {
	bcrypt.compare(password, this.basic.password, callback);
};

loginSchema.methods.generateToken = function(callback) {
	eat.encode({id: this._id}, process.env.APP_SECRET, callback);
};


module.exports = mongoose.model('Login', loginSchema);