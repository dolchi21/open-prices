var Chance = require('chance');
var chance = new Chance();

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


var sequelize = require('./sequelize');



var User = sequelize.models.user;
var Vendor = sequelize.models.vendor;
var Price = sequelize.models.price;
var Product = sequelize.models.product;
var ProductName = sequelize.models.productName;


var setups = {}



setups.users = (function(users){

	var promises = users.map(function(user){
		var salt = password_salt();
		return User.create({
			username : user.username,
			password : sha256(user.password + salt),
			password_salt : salt
		});
	});
	return Promise.all( promises );

})( loadJSON('./examples/users.json') )



setups.products = (function(products){

	var promises = products.map(function(product){
		return Product.create({
			barcode : product.barcode
		}).then(function(p){

			ProductName.create({
				name : product.name,
				productId : p.id,
				userId : 1
			}).then(function(pn){
				console.log(pn.get());
			}).catch(function(err){
				console.error(err);
			});

			return p;
		});
	});
	return Promise.all( promises );

})( loadJSON('./examples/products.json') );



setups.vendors = (function(vendors){
	var afip = require('./afip');

	var promises = vendors.map(function(vendor){
		return afip.persona(vendor).then(function(data){
			return Vendor.create({
				code : data.code(),
				name : data.name(),
				address : data.address()
			}).catch(function(err){
				console.log(err);
			});
		});
	});
	return Promise.all( promises );

})( loadJSON('./examples/vendors.json') );



function loadJSON(file){
	var str = require('fs').readFileSync(file);
	return JSON.parse(str);
}

function onError(err){ return console.error(err); }
