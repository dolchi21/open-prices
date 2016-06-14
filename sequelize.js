var crypto = require('crypto');
var debug = (function(debug){
	var d = debug('db');
	return d;
})(require('debug'));
var util = require('util');
var uuid = require('node-uuid');



var Sequelize = require('sequelize');
var sequelize = new Sequelize('open_prices', 'dolcea', 'amteki17', {
	logging : null
});

{	/* MODELS*/
	var Product = (function(){
		return sequelize.define('Product', {
			barcode : {
				type : Sequelize.STRING,
				allowNull : false,
				unique : true
			}
		});
	})();

	var ProductName = (function(){
		return sequelize.define('ProductName', {
			name : {
				type : Sequelize.STRING,
				allowNull : false
			}
		}, {
			indexes : [{
				unique : true,
				fields : ['ProductId', 'UserId']
			}]
		});
	})();

	var Vendor = (function(){
		return sequelize.define('Vendor', {
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
	})();

	var Price = (function(){
		return sequelize.define('Price', {
			price : {
				type : Sequelize.DOUBLE,
				allowNull : false
			},
			date : {
				type : Sequelize.DATE,
				allowNull : false
			}
		}, {
			indexes : [{
				unique : true,
				fields : ['ProductId', 'UserId', 'VendorId', 'date']
			}]
		});
	})();

	var User = (function(){
		return sequelize.define('User', {
			username : {
				type : Sequelize.STRING,
				allowNull : false,
				unique : true,
				validate : {
					isEmail : true
				}
			},
			password : {
				type : Sequelize.STRING,
				allowNull : false,
				set : function(value){
					var salted_pass = value + this.getDataValue('password_salt');
					var hash = crypto.createHmac('sha256', '').update(salted_pass).digest('hex');
					this.setDataValue('password', hash);
				}
			},
			password_salt : {
				type : Sequelize.STRING,
				allowNull : false,
				defaultValue : function(){
					return uuid.v4();
				}
			}
		}, {
			instanceMethods : {
				passwordEquals : function(str){
					var password = this.getDataValue('password');
					var salt = this.getDataValue('password_salt');
					var hash = crypto.createHmac('sha256', '').update(str + salt).digest('hex');
					return (password == hash);
				}
			}
		});
	})();

	var Report = (function(){
		return sequelize.define('Report', {
			protocol : {
				type : Sequelize.STRING,
				allowNull : false
			},
			hostname : {
				type : Sequelize.STRING,
				allowNull : false
			},
			path : {
				type : Sequelize.STRING,
				allowNull : false
			},
			query : {
				type : Sequelize.STRING
			},
			headers : {
				type : Sequelize.TEXT,
				get : function(){
					if (!this.getDataValue('headers')) { return this.getDataValue('headers'); }
					var json = JSON.parse( this.getDataValue('headers') );
					return json;
				},
				set : function(value){
					if (typeof value == typeof {}) {
						this.setDataValue('headers', JSON.stringify(value));
					} else {
						this.setDataValue('headers', value);
					}
				}
			},
			data : {
				type : Sequelize.TEXT,
				allowNull : false,
				get : function(){
					return JSON.parse(this.getDataValue('data'));
				},
				set : function(value){
					if (typeof value == typeof {}) {
						this.setDataValue('data', JSON.stringify(value));
					} else {
						this.setDataValue('data', value);
					}
				}
			}
		});
	})();
	var Session = (function(){
		return sequelize.define('Session', {
			session_id : {
				type : Sequelize.INTEGER,
				allowNull : false,
				unique : true
			},
			data : {
				type : Sequelize.TEXT,
				allowNull : false,
				get : function(){
					return JSON.parse(this.getDataValue('data'));
				},
				set : function(value){
					if (typeof value == typeof {}) {
						this.setDataValue('data', JSON.stringify(value));
					} else {
						this.setDataValue('data', value);
					}
				}
			}
		});
	})();
}

{	/* RELATIONS */

	Price.belongsTo(User);
	Price.belongsTo(Vendor);
	Price.belongsTo(Product);

	Product.hasMany(ProductName);
	Product.hasMany(Price);
	Product.belongsToMany(Vendor, { through : 'VendorProduct' });

	ProductName.belongsTo(User);
	ProductName.belongsTo(Product);

	User.hasMany(Price);
	User.hasMany(ProductName);

	Vendor.hasMany(Price);
	Vendor.hasMany(Product);

	Session.hasMany(Report);
	Report.belongsTo(Session);
}

if (require.main === module) {
	sequelize.sync({ force : true });
}

module.exports = sequelize;