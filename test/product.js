var Sequelize = require('sequelize');

describe('Product', function(){

	var sequelize = require('../sequelize.js');
	var Product = sequelize.model('Product');

	it('should load a random product.', function(done){
		Product.find({
			include : [{all:true}],
			order : [sequelize.fn('RAND')]
		}).then(function(product){
			done();
		}).catch(function(err) {
			done(new Error(err));
		});
	});

});