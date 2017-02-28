var express = require('express')
var router = express.Router()

var ctrl = require('../controllers/products')

router.get('/', ctrl.getProducts)
router.post('/', ctrl.createProduct)

router.get('/:barcode', ctrl.getProductByBarcode)
router.get('/:barcode/price', ctrl.getProductPrice)
router.get('/:barcode/prices', ctrl.getProductPrices)

module.exports = router
