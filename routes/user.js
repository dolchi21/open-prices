var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');

var config = require('../config');

var sequelize = require('../sequelize');
var User = sequelize.model('User');
var Price = sequelize.model('Price');
var Product = sequelize.model('Product');
var ProductName = sequelize.model('ProductName');

router.use(jwt({
	secret : function secretCallback(req, payload, done){
		done(null, config.JWT_SECRET + req.ip);
	}
}));

router.get('/', function user(req, res){
	res.json(req.user);
});

router.put('/', function update(req, res){
	
	User.findById(req.user.id).then(function(user){

		if (req.body.username) { user.set('username', req.body.username); }
		if (req.body.password) { user.set('password', req.body.password); }

		return user.save().then(function(user){
			res.json(user);
		});

	}).catch(function(err){
		res.status(400).json(err);
	});
	
});

router.get('/prices', function prices(req, res){
	Price.all({
		include : [{
			all : true
		}, {
			model : User,
			where : {
				username : req.user.username
			}
		}]
	}).then(function(prices){
		res.json(prices);
	});
});

router.get('/prices/:id', function price(req, res){
	Price.find({
		where : { id : req.params.id },
		include : [{
			model : User,
			where : {
				username : req.user.username
			}
		}]
	}).then(function(price){
		if (!price) {
			return res.status(404).json([]);
		}
		res.json(price);
	});
});

module.exports = router;
