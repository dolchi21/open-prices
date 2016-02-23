var request = require('request');
request.defaults({ rejectUnauthorized : false });

var express = require('express');
var router = express.Router();

var sequelize = require('../sequelize');

var Product = sequelize.models.product;
var Price = sequelize.models.price;
var Vendor = sequelize.models.vendor;

var afip = require('../afip');


router.get('/', function all(req, res){
	
	Vendor.all().then(function(vendors){

		var arr = vendors.map(function(vendor){
			return vendor.get();
		});

		res.json(arr);

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