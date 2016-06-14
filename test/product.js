var Sequelize = require('sequelize');

describe('Product', function(){

	var sequelize = require('../sequelize.js');
	var Product = sequelize.model('Product');

	it('should load a random product.', function(done){
		Product.find({
			include : [{all:true}],
			order : [sequelize.fn('RAND')]
		}).then(function(product){
			console.log(product.get())
			done();
		});
	});

});