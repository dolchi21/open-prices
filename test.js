var sequelize = require('./sequelize.js');



var Product = sequelize.models.product;



Product.findOne().then(function(product){
	
	return product.getPrices();

}).then(function(prices){

	var arr = prices.map(function(price){
		return price.get();
	});

	console.log(arr.length, arr);

});