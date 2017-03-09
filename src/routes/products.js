var express = require('express')
var router = express.Router()

var tokenMiddleware = require('../lib/jwt').middleware
var ctrl = require('../controllers/products')

router.get('/', ctrl.getProducts)
router.post('/', tokenMiddleware(), ctrl.createProduct)

router.get('/:barcode', ctrl.getProductByBarcode)
router.get('/:barcode/price', ctrl.getProductPrice)
router.get('/:barcode/prices', ctrl.getProductPrices)

router.post('/:barcode/prices', require('../lib/jwt').middleware(), (req, res, next) => {
    var { price, date, vendor } = req.body
    var err = new Error()
    err.name = 'InvalidForm'
    if (!price || !vendor || !date) {
        return next(err)
    }
    
    err.message = 'No user'
    if (!req.user) { return next(err) }
    if (!req.user.data) { return next(err) }
    if (!req.user.data.id) { return next(err) }

    next()
})
router.post('/:barcode/prices', ctrl.createProductPrice)

router.get('/:barcode/names', ctrl.getProductNames)

module.exports = router
