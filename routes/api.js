var express = require('express');
var router = express.Router();



var auth = require('./auth');
router.use('/auth', auth);


var user = require('./user');
router.use('/user', user);


var prices = require('./prices');
var products = require('./products');
var vendors = require('./vendors');

router.use('/prices', prices);
router.use('/products', products);
router.use('/vendors', vendors);


var reports = require('./reports');
router.use('/reports', reports);


module.exports = router;