var seneca = require('../seneca-client')

var services = require('../openprices-services')
var Products = services.products
var Vendors = services.vendors

export function getUserProducts(req, res, next){

    var action = Products.getProducts()
    action.includeAll = !!req.query.includeAll
    action.UserId = req.user.id

    seneca.act(action, (err, response) => {
        if (err) return next(err)

        var { data } = response
        delete response.data
        try{

        res.json({
            response,
            data: data.map(ProductInterface)
        })
        }catch(e){ console.log(e)}
    })

}
export function getProducts(req, res, next){

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

export function getProductByBarcode(req, res, next){

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

}

export function getProductPrice(req, res, next){
    
    var action = Products.getProductAveragePrice(req.params.barcode)
    
    seneca.act(action, (err, response) => {
        if (err) return next(err)
        var data = response.data
        res.json({
            data
        })
    })

}

export function getProductPrices(req, res, next){

    var action = Products.getProductAveragePrice(req.params.barcode)
    console.log(action)

    seneca.act(action, (err, response) => {
        if (err) return next(err)
        res.json(response)
    })

}

function ProductInterface(p) {
    
    var name = ((names) => {
        if (!names.length) return
        return names[0].name
    })(p.ProductNames || []);

    var vendors = ((vendors) => {
        if (!vendors.length) return
        return vendors.map(VendorInterface)
    })(p.Vendors || []);

    var obj = {
        id: p.id,
        barcode: p.barcode,
        name,
        vendors,
        updatedAt: p.updatedAt
    }
    return obj
}
function VendorInterface(v){
    var obj = {
        code : v.code,
        name : v.name
    }
    return obj
}