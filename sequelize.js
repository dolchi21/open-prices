var util = require('util');

(function init_db(reset){


	if (!reset) {
		module.exports = init_sequelize();
		return;
	}


	var mysql = require('mysql');
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root', password : 'dugtgz'
	});
	connection.connect();

	util.log('dropping');
	connection.query('DROP DATABASE IF EXISTS open_prices', function(){
		util.log('creating');
		connection.query('CREATE DATABASE IF NOT EXISTS open_prices', function(err, rs){
			connection.end();
			module.exports = init_sequelize();
		});
	});
})(process.argv[2]);

if (process.argv[2]) { return; }



function init_sequelize(){
	var Sequelize = require('sequelize');
	var sequelize = new Sequelize('open_prices', 'root', 'dugtgz', {
		logging : null
	});
	var request = require('request');

	var sync_options = {
		force : true
	}

	var syncs = []

	{	/* MODELS*/
		var Product = sequelize.define('product', {
			barcode : {
				type : Sequelize.STRING,
				allowNull : false,
				unique : true
			}
		});



		var ProductName = sequelize.define('productName', {
			name : {
				type : Sequelize.STRING,
				allowNull : false
			},
			productId : {
				type : Sequelize.INTEGER,
				allowNull : false
			}
		}, {
			indexes : [
			{
				unique : true,
				fields : ['productId', 'userId']
			}
			]
		});



		var Vendor = sequelize.define('vendor', {
			code : {
				type : Sequelize.STRING,
				allowNull : false,
				unique : true
			},
			name : {
				type : Sequelize.STRING
			},
			address : {
				type : Sequelize.STRING
			}
		});



		var Price = sequelize.define('price', {
			price : {
				type : Sequelize.DOUBLE,
				allowNull : false
			},
			date : {
				type : Sequelize.DATE,
				allowNull : false
			}
		}, {
			indexes : [
			{
				unique : true,
				fields : ['productId', 'userId', 'vendorId', 'date']
			}
			]
		});



		var User = sequelize.define('user', {
			username : {
				type : Sequelize.STRING,
				allowNull : false,
				unique : true
			},
			password : {
				type : Sequelize.STRING,
				allowNull : false
			},
			password_salt : {
				type : Sequelize.STRING,
				allowNull : false,
				defaultValue : 'default_salt'
			}
		});

		

	}

	{	/* RELATIONS */
		Product.hasMany(ProductName);
		User.hasMany(ProductName);

		Product.hasMany(Price);
		User.hasMany(Price);
		Vendor.hasMany(Price);

		Price.belongsTo(User);
		Price.belongsTo(Vendor);
		Price.belongsTo(Product);
	}

	{	/* SYNC */
		syncs.push( Product.sync() );
		syncs.push( User.sync() );
		syncs.push( Vendor.sync() );

		Promise.all(syncs).then(function(){
			Price.sync().catch(onError);
			ProductName.sync().catch(onError);
		}).catch(onError);
		//sequelize.sync();
	}



	return sequelize;
}

function onError(err){
	console.error(err);
}