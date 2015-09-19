'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/students_dev'); // localhost/ 뒤에 오는 것이 db 이름이된다.
process.env.APP_SECRET = process.env.APP_SECRET || 'need to change';

var studentsRouter = require(__dirname + '/routes/students_routes');
var loginRouter = require(__dirname + '/routes/login_routes');
app.use('/api', studentsRouter);
app.use('/api', loginRouter);
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Server up on port: '+ port);
});
