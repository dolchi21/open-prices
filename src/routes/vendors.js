var express = require('express')
var router = express.Router()

var ctrl = require('../controllers/vendors')

router.get('/', ctrl.getVendors)

router.get('/:id', ctrl.getVendor)

module.exports = router
