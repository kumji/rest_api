'use strict';
var Student = require(__dirname + '/../models/students');
var express = require('express');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');

var studentsRoute = module.exports = exports = express.Router();

studentsRoute.get('/students', function(req, res) {
	Student.find({}, function(err,data) {
		if (err) return handleError(err,res);
		res.json(data);
	});
}); 

studentsRoute.get('/students/:name', function(req,res) {
	Student.find({name:req.params.name}, function(err,data){
		if(err) return handleError(err,res);
		res.json(data);
	});

});

studentsRoute.post('/students', jsonParser, function(req,res) {
	var newStudent = new Student(req.body);
	newStudent.save(function(err, data) {
		if (err) handleError(err,res);
		Student.schema.path('name').validate(function(value) {
		return value.length<20;}, "Too long name");
		res.json(data);
	});
});
	