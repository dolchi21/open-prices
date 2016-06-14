var url = require('url');
var util = require('util');

var express = require('express');
var router = express.Router();


var Report = require('../sequelize').model('Report');


router.post('/', function report(req, res){
	
	var referer = req.headers['referer'];

	var url_data = url.parse(referer);

	console.log(url_data)

	var report = {
		protocol : req.protocol,
		hostname : url_data.hostname,
		path : url_data.pathname,
		query : url_data.query,
		data : req.body
	}
	console.log(report)

	Report.create(report).then(function(report){
		res.json(report);
	});
});
router.get('/', function(req, res){
	Report.all({
		order : 'id DESC'
	}).then(function(reports){
		var json = reports.map(function(report){
			return report.get();
		});
		res.json(json);
	});
});

module.exports = router;