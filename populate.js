var Chance = require('chance');
var chance = new Chance();

var sha256 = function sha256(str) {
	var crypto = require('crypto');
	var hash = crypto.createHmac('sha256', 'open-prices').update(str).digest('hex');
	return hash;
}


var sequelize = require('./sequelize');



var User = sequelize.model('User');
var Vendor = sequelize.model('Vendor');
var Price = sequelize.model('Price');
var Product = sequelize.model('Product');
var ProductName = sequelize.model('ProductName');


var setups = {}



setups.users = (function(users){

	var promises = users.map(function(user){
		return User.create({
			username : user.username,
			password : user.password,
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
				ProductId : p.id,
				UserId : 1
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
