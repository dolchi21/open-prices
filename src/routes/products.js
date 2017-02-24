var express = require('express')
var router = express.Router()

var seneca = require('../seneca-client')

var services = require('../openprices-services')
var Products = services.products

router.get('/', (req, res, next) => {

    var action = Products.getProducts()
    action.includeAll = !!req.query.includeAll

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            //data: data.map(product => product.barcode),
            data
        })
    })

})

router.get('/:barcode', (req, res, next) => {

    var action = Products.getProduct(req.params.barcode)

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            data
        })
    })

})

router.get('/:barcode/prices', (req, res, next) => {

    var action = Products.getProductAveragePrice(req.params.barcode)
    console.log(action)

    seneca.act(action, (err, response) => {
        if (err) return next(err)
        res.json(response)
    })

})

module.exports = router
