var express = require('express')
var router = express.Router()

var seneca = require('../seneca-client')

var services = require('../openprices-services')
var Vendors = services.vendors


var auth = require('./auth')
router.use('/auth', auth)

var products = require('./products')
router.use('/products', products)

router.get('/vendors', (req, res, next) => {

    var action = Vendors.getVendors()
    seneca.act(action, function (err, response) {

        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            data
        })

    })

})

module.exports = router
