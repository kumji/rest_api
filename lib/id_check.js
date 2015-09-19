module.exports = exports = function(req, res, next) {
	var loginPassEncoded = (req.headers.authorization || ' :').split(' ')[1];
	var loginPassBuff = new Buffer(loginPassEncoded, 'base64');
	var loginPassSplit = loginPassBuff.toString('utf8').split(':');
	req.auth = {
		email: loginPassSplit[0],
		password: loginPassSplit[1]
	};
	if (!(req.auth.email.length && req.auth.password.length)) {
		console.log('could not authenticate: ' + req.auth.email);
		return res.status(401).send({msg: 'could not authenticate'});
	}
	next();
};
