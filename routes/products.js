var moment = require('moment');

var express = require('express');
var router = express.Router();
var sequelize = require('../sequelize');

var Product = sequelize.models.product;
var ProductName = sequelize.models.productName;
var Price = sequelize.models.price;
var User = sequelize.models.user;
var Vendor = sequelize.models.vendor;



router.get('/', function all(req, res){
	
	Product.all({
		order : 'barcode',
		include : [ { model : Price } ]
	}).then(function(products){

		var arr = products.map(function(product){
			return product.get();
		});

		res.json(arr);

	});

});

router.post('/', function(req, res){

	var barcode = req.body.barcode;
	var product_name = req.body.name;

	

	if (!isBarcode(barcode)) { return res.status(400).json({ err : barcode + ' is not a barcode' }); }



	Product.create({
		barcode : barcode,
		ProductName : [{ name : product_name }]
	}, {
		include : [ ProductName ]
	}).then(function(product){
		
		res.json( product.get() );

	}).catch(function(err){
		if (err.name === 'SequelizeUniqueConstraintError') {
			return Product.findOne({
				where : { barcode : barcode }
			});
		}
		return res.status(400).json(err);
	}).then(function(product){

		return ProductName.create({
			name : product_name
		}).then(function(product_name){
			product.addProductName(product_name);
			return product;
		})

	}).then(function(product){
		res.json( product.get() );
	});

});

router.get('/random', function random(req, res){
	var chance = new require('chance')();

	var barcode = '779' + chance.integer({
		min : 1000000000, max : 9999999999
	}).toString();

	Product.create({
		barcode : barcode
	}).then(function(product){
		
		res.json( product.get() );

	}).catch(function(){

		res.send('could not create random product');

	});

});

router.get('/:barcode', function(req, res){

	Product.findOne({
		where : {
			barcode : req.params.barcode
		},
		include : [{
			model : Price,
			include : [{
				all : true
			}]
		}],
		order : 'prices.date DESC'
	}).then(function(product){
		
		if (!product) { return res.json([]); }

		var json = product.get();
		json.prices = product.prices.map(function(price){
			return {
				vendor : {
					code : price.vendor.code,
					name : price.vendor.name
				},
				price : price.price,
				date : price.date
			}
		});
		res.json(json);

	});
});

router.get('/:barcode/prices', function(req, res){
	Product.findOne({
		where : {
			barcode : req.params.barcode
		}
	}).then(function(product){
		return Price.all({
			where : {
				productId : product.id
			},
			order : 'date DESC, price',
			//include : [{all:true}]
		});
	}).then(function(prices){
		res.json( prices.map(function(e){
			return e.get();
		}) );
	}).catch(function(err){
		res.json(err);
	});
});

router.post('/:barcode/prices', function(req, res){



	var username = 'dolcea';

	var new_price = req.body.price;
	var vendor = req.body.vendor;
	var date = moment( req.body.date ).hour(0).minute(0).second(0).millisecond(0);
	console.log( 'DATE', req.body.date, date.toDate() );


	function onInstance(instance, model){
		if ( !instance ) { return Promise.reject(model + ' not found'); }
		return instance;
	}

	var p1 = Product.findOne({
		where : { barcode : req.params.barcode }
	}).then(function(instance){
		if ( !instance ) { return Promise.reject('Product not found'); }
		return instance;
	});
	var p2 = Vendor.findOne({
		where : { code : req.body.vendor }
	}).then(function(instance){
		if ( !instance ) { return Promise.reject('Vendor not found'); }
		return instance;
	});
	var p3 = User.findOne({
		where : { username : username }
	}).then(function(instance){
		if ( !instance ) { return Promise.reject('User not found'); }
		return instance;
	});


	
	Promise.all([p1, p2, p3]).then(function(r){

		var product = r[0];
		var vendor = r[1];
		var user = r[2];

		return Price.create({
			price : req.body.price,
			date : date.toDate(),
			productId : product.id,
			userId : user.id,
			vendorId : vendor.id
		});

	}).catch(function(err){
		console.error(err);
		res.status(500).json(err);
	}).then(function(price){
		res.json( price.get() );
	});
});



function isBarcode(barcode){
	return /\d{13}/g.test(barcode);
}



module.exports = router;