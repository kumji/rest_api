var eat = require('eat');
//var Students = require(__dirname + '/../models/students');
var handleError = require(__dirname + '/../lib/handle_error');
var Login = require(__dirname + '/../models/students_login');

module.exports = exports = function(req, res, next) {
	var encryptedToken = req.headers.token || (req.body? req.body.token: undefined);
	if (!encryptedToken)
		return res.status(401).json({msg: 'could not authenticate'});
		eat.decode(encryptedToken, process.env.APP_SECRET, function(err, token) {
			if(err) return handleError(err,res);
			Login.findOne({_id: token.id}, function(err, user) {
				if(err) return handleError(err,res);
				if(!user) return res.status(401).json({msg: 'could not authenticate'});
				req.user = user;
				next();		
			});
		});
};