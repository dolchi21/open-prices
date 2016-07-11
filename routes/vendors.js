var request = require('request');
request.defaults({ rejectUnauthorized : false });

var express = require('express');
var router = express.Router();

var sequelize = require('../sequelize');

var Product = sequelize.model('Product');
var Price = sequelize.model('Price');
var Vendor = sequelize.model('Vendor');

var afip = require('../afip');


router.get('/', function all(req, res){
	
	Vendor.all({
		offset : req.query.skip || 0,
		limit : req.query.take || 10
	}).then(function(vendors){

		var arr = vendors.map(function(vendor){
			return vendor.get();
		});

		res.json(arr);

	});

});

router.get('/:code', function vendor(req, res){
	Vendor.findOne({
		where : { code : req.params.code }
	}).then(function(vendor){
		if (!vendor) {
			return res.json({
				code : req.params.code,
				vendor : null
			});
		}
		return res.json( vendor.get() );
	});
});
router.get('/:code/products', function vendorProducts(req, res){
	Vendor.findOne({
		where : { code : req.params.code }
	}).then(function(vendor){
		if (!vendor) {
			return null;
		}
		console.log(vendor.get());
		return vendor.getProducts();
	}).then(function(products){

		if (!products) {
			return res.send('No products yet.');
		}

		var json = products.map(function(product){ return product.get(); });

		res.json(json);

	});
});

router.get('/random', function random(req, res){
	var chance = new require('chance')();

	var code = '30' + chance.integer({
		min : 302510040,
		max : 642510040
	}).toString();

	Vendor.create({
		code : code,
		name : chance.name(),
		address : chance.address() + ', ' + chance.city()
	}).then(function(vendor){
		
		res.json( vendor.get() );

	});

});

router.get('/:code', function(req, res){
	afip.persona( req.params.code ).then(function(data){

		return Vendor.upsert({
			code : req.params.code,
			name : data.nombre,
			address : data.address()
		}).then(function(){
			return Vendor.findOne({
				where : {
					code : req.params.code
				}
			});
		}).catch(function(err){ console.error(err); });

	}).catch(function(err){
		res.json(err);
	}).then(function(vendor){
		res.json( vendor.get() );
	});
});



module.exports = router;