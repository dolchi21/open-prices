var express = require('express');
var router = express.Router();

var Promise = require('bluebird');

var jwt = require('express-jwt');

var config = require('../config');

var sequelize = require('../sequelize');
var Price = sequelize.model('Price');
var Product = sequelize.model('Product');
var ProductName = sequelize.model('ProductName');
var User = sequelize.model('User');
var Vendor = sequelize.model('Vendor');

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

router.post('/prices', function(req, res){
	var barcode = req.body.barcode;
	var price = req.body.price;
	var price_date = req.body.price_date ? new Date(req.body.price_date) : new Date() ;
	var vendor_code = req.body.vendor_code;

	if (!barcode || !vendor_code || !price) {
		return res.status(400).json({
			barcode : barcode?true:false,
			vendor_code : vendor_code?true:false,
			price : price?true:false
		});
	}

	var onProduct = Product.findOne({
		where : {
			barcode : barcode
		}
	});
	var onVendor = Vendor.findOne({
		where : {
			code : vendor_code
		}
	});

	Promise.all([onProduct, onVendor]).spread(function(product, vendor){
		
		if (!product || !vendor) { return res.status(400).send('Bad input.'); }

		product.addVendor(vendor);

		Price.create({
			price : price,
			date : price_date,
			VendorId : vendor.get('id'),
			ProductId : product.get('id'),
			UserId : req.user.id
		}).then(function(price){
			res.json(price.get());
		});
		
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
