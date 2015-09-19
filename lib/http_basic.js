module.exports = exports = function(req, res, next) {
	var studentPassEncoded = (req.headers.authoization || ':').split(' ')[1];
	var studentPassBuff = new Buffer(studentPassEncoded, 'base64');
	var studentPassSplit = studentPassBuff.toString('utf8').split(':');
	req.auth = {
		email: studentPassSplit[0],
		password: studentPassSplit[1]
	};
	if (!(req.auth.email.length && req.auth.password.length)) {
		console.log('could not authenticate: ' + req.auth.email);
		return res.status(401).send({msg: 'could not authenticat'});
	}
	next();
};
