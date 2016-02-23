var sequelize = require('./sequelize');



var User = sequelize.models.user;
var Vendor = sequelize.models.vendor;
var Price = sequelize.models.price;
var Product = sequelize.models.product;



var setups = {}



setups.products = (function(products){

	var promises = products.map(function(source){

		Product.findOne({
			where : { barcode : source.barcode }
		}).then(function(product){

			if(!source.prices){ return; }

			source.prices.map(function(price){

				var p1 = User.findOne({
					where : { username : price.username }
				}).then(function(user){
					if (!user) { return Promise.reject('no user ' + price.username); }
					return user;
				});
				var p2 = Vendor.findOne({
					where : { code : price.vendor }
				});

				Promise.all([p1, p2]).then(function(ffms){

					var user = ffms[0];
					var vendor = ffms[1];

					return Price.create({
						price : price.price,
						date : price.date,
						productId : product.id,
						userId : user.id,
						vendorId : vendor.id
					}).then(function(price){
						console.log('new price', price.get());
					}).catch(function(err){ console.error(err); });

				}).catch(function(err){ console.error(err); });

			});
						
		});

		

	});
	return Promise.all( promises );

})( loadJSON('./examples/products.json') );






function loadJSON(file){
	var str = require('fs').readFileSync(file);
	return JSON.parse(str);
}

function onError(err){ return console.error(err); }
