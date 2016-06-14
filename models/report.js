var Sequelize = require('sequelize');

var sequelize = require('../sequelize');

var Report = (function(){
	return sequelize.define('Report', {
		domain : {
			type : Sequelize.STRING,
			allowNull : false
		},
		url : {
			type : Sequelize.STRING,
			allowNull : false
		},
		request : {
			type : Sequelize.TEXT,
			allowNull : false,
			get : function(){
				return JSON.parse(this.getDataValue('request'));
			},
			set : function(value){
				if (typeof value == typeof {}) {
					this.setDataValue('request', JSON.stringify(value));
				} else {
					this.setDataValue('request', value);
				}
			}
		},
		headers : {
			type : Sequelize.TEXT,
			allowNull : false,
			get : function(){
				var json = JSON.parse(this.getDataValue('headers'));
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

if (require.main === module) {
	Report.sync({ force : true });
}

module.exports = Report;