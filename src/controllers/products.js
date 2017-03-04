var seneca = require('../seneca-client')

var sequelize = require('../sequelize').default

var services = require('../openprices-services')
var Products = services.products
var Vendors = services.vendors

export function getUserProducts(req, res, next) {

    var action = Products.getProducts()
    action.includeAll = !!req.query.includeAll
    action.UserId = req.user.id

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            data: data.map(ProductInterface)
        })
    })

}

export function getProducts(req, res, next) {

    var action = Products.getProducts()
    action.includeAll = !!req.query.includeAll

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            data: data.map(ProductInterface)
        })
    })

}
export function getProductByBarcode(req, res, next) {

    var action = Products.getProduct(req.params.barcode)

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data

        res.json({
            response,
            data: ProductInterface(data)
        })
    })

    seneca.act({
        SERVICE: 'PRODUCTS', TYPE: 'PRODUCT_NAME', barcode: req.params.barcode
    }, function (err, response) {
        console.log(err, response)
        console.log('NAME')
    })

}
export function getProductPrice(req, res, next) {

    var action = Products.getProductAveragePrice(req.params.barcode)

    seneca.act(action, (err, response) => {
        if (err) return next(err)
        var data = response.data
        res.json({
            data
        })
    })

}
export function getProductPrices(req, res, next) {
    var Product = sequelize.model('Product')

    var { barcode } = req.params

    Product.findOne({
        where: {
            barcode
        }
    }).then(function (product) {
        return product.getPrices({
            order: 'date DESC'
        }).then(function (prices) {
            var p = ProductModelInterface(product)
            p.prices = prices.map(PriceModelInterface)
            res.json({
                meta: p,
                data: p.prices
            })
        })
    }).catch(err => {
        next(err)
    })
}
export function getProductPrices2(req, res, next) {

    var action = Products.getProductAveragePrice(req.params.barcode)
    console.log(action)

    seneca.act(action, (err, response) => {
        if (err) return next(err)
        res.json(response)
    })

}

export function createProduct(req, res, next) {

    var { Product, ProductName } = sequelize.models

    var user = req.user || {
        id: 1
    }

    var { barcode, name } = req.body

    Product.findOrCreate({
        where: {
            barcode
        },
        defaults: { name }
    }).then(([product, created]) => {
        return ProductName.findOrCreate({
            where: {
                UserId: user.id,
                ProductId: product.id
            },
            defaults: { name }
        }).then(([product_name, created]) => {
            if (!created) {
                product_name.name = name
            }
            return product_name.save()
        }).then((pname) => {
            res.json({
                meta: {
                    name: pname
                },
                data: ProductModelInterface(product)
            })
        })
    }).catch(err => {
        next(err)
    })


}

function ProductInterface(p) {

    console.log(p.name)

    var vendors = ((vendors) => {
        if (!vendors.length) return
        return vendors.map(VendorInterface)
    })(p.Vendors || []);

    var obj = {
        id: p.id,
        barcode: p.barcode,
        name: p.name,
        vendors,
        updatedAt: p.updatedAt,
        //_data: p
    }
    return obj
}
function ProductModelInterface(p) {
    return ProductInterface(p.get())
}
function VendorInterface(v) {
    var obj = {
        code: v.code,
        name: v.name
    }
    return obj
}
function PriceInterface(pr) {
    var obj = {
        price: pr.price,
        date: pr.date,
        vendor: pr.VendorId,
        user: pr.UserId
    }
    return obj
}
function PriceModelInterface(pr) {
    return PriceInterface(pr.get())
}