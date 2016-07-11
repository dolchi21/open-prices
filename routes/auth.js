var express = require('express');
var router = express.Router();

var jsonwebtoken = require('jsonwebtoken');
var jwt = require('express-jwt');
var uuid = require('node-uuid');



var config = require('../config');

var sequelize = require('../sequelize');
var User = sequelize.model('User');



router.post('/register', function register(req, res){
	
	var username = req.body.username;
	var password = req.body.password;

	User.create({
		username : username,
		password : password
	}).then(function(user){
		
		return res.json( user.get() );

	}).catch(function(err){
		
		switch (err.name) {
			
			case 'SequelizeUniqueConstraintError':
			return res.status(400).json({
				code : 88400,
				message : 'Username already exists.'
			});
			break;

			default:
			return res.status(500).json(err);
			break;
		}

	});
});

router.get('/users', function users(req, res){
	
	User.all({
		offset : parseInt(req.query.skip || 0),
		limit : parseInt(req.query.take || 10)
	}).then(function(users){
		var json = users.map(function(u){
			return {
				id : u.id,
				username : u.username
			}
		});
		return res.json(json);
	});

});

router.post('/token', function token(req, res){

	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		where : {
			username : username
		}
	}).then(function(user){

		if (!user) { res.status(400).json(null); }

		if (user.passwordEquals(password)) {
			var payload = {
				id : user.get('id'),
				username : user.get('username')
			}
			var token = jsonwebtoken.sign(payload, config.JWT_SECRET + req.ip, {
				issuer : 'openprices',
				expiresIn : 60 * 15,
				jwtid : uuid.v4()
			});
			res.json({ token : token });
		} else {
			res.status(400).json(null);
		}

	});

});


var secretCallback = function(req, payload, done){
	done(null, config.JWT_SECRET + req.ip);
}
router.get('/protected', jwt({ secret : secretCallback }), function protected(req, res){

	res.json(req.user);

});

module.exports = router;
