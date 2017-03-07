var express = require('express')
var router = express.Router()

var ctrl = require('../controllers/products')

router.get('/', ctrl.getProducts)
router.post('/', ctrl.createProduct)

router.get('/:barcode', ctrl.getProductByBarcode)
router.get('/:barcode/price', ctrl.getProductPrice)
router.get('/:barcode/prices', ctrl.getProductPrices)

router.post('/:barcode/prices', (req, res, next) => {
    var { price, date, vendor } = req.body
    var err = new Error()
    err.name = 'InvalidForm'
    if (!price || !vendor || !date) {
        return next(err)
    }
    next()
})
router.post('/:barcode/prices', ctrl.createProductPrice)

module.exports = router
