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
    }, function (err, response) { })

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
/*export function getProductPrices2(req, res, next) {

    var action = Products.getProductAveragePrice(req.params.barcode)
    console.log(action)

    seneca.act(action, (err, response) => {
        if (err) return next(err)
        res.json(response)
    })

}*/
export function getProductNames(req, res, next){
    
    var { barcode } = req.params

    sequelize.model('Product').findOne({
        where : { barcode }
    }).then(product => {
        return product.getProductNames().then(names => {
            res.json({
                data : names.map(n => n.get())
            })
        })
    }).catch(next)

}

export function createProduct(req, res, next) {

    var { Product, ProductName } = sequelize.models

    var user = req.user.data

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

export function createProductPrice(req, res, next) {

    var user = req.user.data
    var { barcode } = req.params
    var { price, date, vendor, vendor_code } = req.body

    var date = (function normalizeDate(date) {
        var date = date ? new Date(date) : new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
    })(date)


    var { Product, Price, Vendor } = sequelize.models


    var onProduct = Product.findOne({
        where: { barcode }
    })
    var onVendor = Vendor.findOne({
        where: { code: vendor_code || vendor }
    }).then(v => {
        if (!v) {
            return require('../lib/Vendors').createAFIPVendor(vendor_code || vendor)
        }
        return v
    })


    Promise.all([onProduct, onVendor]).then(([product, vendor]) => {
        return Price.findOne({
            where: {
                date,
                UserId: user.id,
                ProductId: product.id,
                VendorId: vendor.id
            }
        }).then(p => {
            if (p) {
                return p.update({
                    price,
                    updatedAt: new Date()
                })
            }
            return Price.create({
                date,
                UserId: user.id,
                ProductId: product.id,
                VendorId: vendor.id,
                price
            })
        }).then(price => {
            res.json({
                price,
                product,
                vendor
            })
        }).catch(err => {
            res.status(500).json(err)
        })
    })

}

function ProductInterface(p) {

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
        id: pr.id,
        price: pr.price,
        date: pr.date,
        product : pr.ProductId,
        vendor: pr.VendorId,
        user: pr.UserId
    }
    return obj
}
function PriceModelInterface(pr) {
    return PriceInterface(pr.get())
}