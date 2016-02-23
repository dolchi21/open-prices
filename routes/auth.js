var chance = new require('chance')();

var express = require('express');
var router = express.Router();


var sequelize = require('../sequelize');
var User = sequelize.models.user;


router.post('/register', function(req, res){
	
	var username = req.body.username;
	var password = req.body.password;
	var salt = password_salt();

	User.create({
		username : username,
		password : sha256(password + salt),
		password_salt : salt
	}).then(function(user){
		
		return res.json( user.get() );

	}).catch(function(err){
		
		switch (err.name) {
			
			case 'SequelizeUniqueConstraintError':
			return res.status(400).json(err);
			break;

			default:
			return res.status(500).json(err);
			break;
		}

	});
});

router.get('/users', function(req, res){
	User.all().then(function(users){
		var json = users.map(function(u){
			return {
				username : u.username,
				id : u.id
			}
		});
		res.json(json);
	});
});

module.exports = router;

var sha256 = function sha256(str) {
	var crypto = require('crypto');
	var hash = crypto.createHmac('sha256', 'open-prices').update(str).digest('hex');
	return hash;
}
var password_salt = function(){
	return chance.string({
		length : 4,
		pool : 'abcdefghijklmnopqrstuvwxyz0123456789'
	});
}

function instances2object(instances){
	return instances.map(function(i){
		return i.get();
	});
}