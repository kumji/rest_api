var express = require('express');
var Login = require(__dirname + '/../models/students_login');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var id_check = require(__dirname + '/../lib/id_check');

var loginRoute = module.exports = exports = express.Router();

loginRoute.get('/signin', id_check, function(req,res){
	Login.findOne({'basic.email': req.auth.email}, function(err, user) {
		if(err) return handleError(err,res);

		if(!user) {
			console.log('could not authenticate' + req.auth.email);
			return res.status(401).json({msg: 'could not anthenticate'});
		}

		user.compareHash(req.auth.password, function(err, hashRes) {
			if (err) return handleError(err, res);
			if (!hashRes) {
				console.log('could not authenticate: ' + req.auth.email);
				return res.status(401).json({msg: 'could not anthenticate'});
			}
			user.generateToken(function(err, token) {
				if (err) return handleError(err, res);
				res.json({token: token});
			});
		});
	});
});


	
loginRoute.post('/signup', jsonParser, function(req,res){
	var newLogin = new Login();
	newLogin.email = req.body.email;
	newLogin.basic.email = req.body.email;
	newLogin.generateHash(req.body.password, function(err, hash) {
		if (err) return handleError(err, res);
		newLogin.save(function(err, data) {
			if(err) return handleError(err, res);
			newLogin.generateToken(function(err, token){
				if(err) return handleError(err, res);
				res.json({token: token});
			});
		});
	});
});
