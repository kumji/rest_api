'use strict';

var chai = require('chai'),
	expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
process.env.MONGO_URL = 'mongodb://localhost/test'
var mongoose = require('mongoose');
var Student = require(__dirname+'/../models/students');
var Login = require(__dirname+'/../models/students_login')


require(__dirname + '/../server.js');

var url = 'localhost:3000/api';

describe('students database', function() {
	after(function(done) {
		mongoose.connection.db.dropDatabase(function(err) {
			 if (err) throw err;
			 done();
		});
	});

	it('should be able to get list of students.', function(done) {
		chai.request(url)
		  .get('/students')
		  .end(function(err, res) {
		  	expect(err).to.eql(null);
		  	expect(Array.isArray(res.body)).to.eql(true);
		  	done();
		  });
	});

	it('should be able to add a student.', function(done){
		chai.request(url)
			.post('/students')
			.send({name: 'John', email: 'test@test.com', age: 18, score: 40})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.name).to.eql('John');
				expect(res.body.email).to.eql('test@test.com');
				expect(res.body.age).to.eql(18);
				expect(res.body.score).to.eql(40);
				done();
			});
	});

	it('should find John by name', function(done){
		chai.request(url)
			.get('/students/John')
			.end(function(err,res) {
				expect(err).to.eql(null);
				expect(Array.isArray(res.body)).to.eql(true);
				done();
			});
	});
});



