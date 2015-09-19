var chai = require('chai'),
	chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var mongoose = require('mongoose');
process.env.MONGO_URL = 'mongodb://localhost/students_test';

require(__dirname + '/../server');
var Login = require(__dirname + '/../models/students_login');
var eatauth = require(__dirname+'/../lib/eat_auth');
var idcheck = require(__dirname + '/../lib/id_check');

describe('idcheck', function() {
	it('should be able to parse idcheck auth', function() {
		var req = {
			headers: {
				authorization: 'Student ' + (new Buffer('test@student.com:foobar123')).toString('base64')
			}
		};

		idcheck(req, {}, function() {
			expect(typeof req.auth).to.eql('object');
			expect(req.auth.email).to.eql('test@student.com');
			expect(req.auth.password).to.eql('foobar123');
		});
	});
});

describe('auth', function() {
	after(function(done){
		mongoose.connection.db.dropDatabase(function() {
			done();
		});
	});

	it('should be able to create a account', function(done) {
		chai.request('localhost:3000/api')
			.post('/signup')
			.send({email: 'test@student.com', password: 'foobar123'})
			.end(function(err, res) {
				expect(err).to.eql(null);
				expect(res.body.token).to.have.length.above(0);
				done();
			});
	});

	describe('email already in database', function () {
		before(function(done) {
			var login = new Login();
			login.email = 'test@student.com';
			login.basic.email = 'test@student.com';
			login.generateHash('foobar123', function(err,res) {
				if(err) throw err;
				login.save(function(err, data) {
					if(err) throw err;
					login.generateToken(function(err, token) {
						if(err) throw err;
						this.token = token;
						done();
					}.bind(this));
				}.bind(this));
			}.bind(this));
		});

		it('should be able to sign in', function(done) {
			chai.request('localhost:3000/api')
				.get('/signin')
				.auth('test@student.com', 'foobar123')
				.end(function(err, res) {
					expect(err).to.eql(null);
					done();
				});
		});

		it('should be able to authenticate with eat auth', function(done) {
			var token = this.token;
			var req = {
				headers: {
					token: token
				}
			};

			eatauth(req, {}, function() {
				expect(req.user.email).to.eql('test@student.com');
				done();
			});
		});
	});
});




