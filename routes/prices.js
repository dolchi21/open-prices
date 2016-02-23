var Sequelize = require('sequelize');

var express = require('express');
var router = express.Router();
var sequelize = require('../sequelize');

var Product = sequelize.models.product;
var Price = sequelize.models.price;
var Vendor = sequelize.models.vendor;
var User = sequelize.models.user;



router.get('/', function all(req, res){});

router.get('/random', function random(req, res){


	var rand = {
		order : [ Sequelize.fn('RAND') ]
	}

	var promises = []
	promises.push( Product.findOne(rand).catch(onReject) );
	promises.push( Vendor.findOne(rand).catch(onReject) );
	promises.push( User.findOne(rand).catch(onReject) );

	Promise.all(promises).then(function(resolutions){

		var chance = new require('chance')();
		var price = chance.dollar({ max : 250 }).replace('$', '');

		return Price.create({
			price : price,
			date : chance.date({ year : 2015 })
		}).then(function(price){
			
			price.setProduct(resolutions[0]);
			price.setVendor(resolutions[1]);
			price.setUser(resolutions[2]);

			return price;
		}).catch(function(){
			console.error('ERROR', 'Price.create')
		});
	}).then(function(price){
		res.json( price.get() );
	});


});

function onReject(err){ return console.error('ERROR', err); }



module.exports = router;