var seneca = require('../seneca-client')

var sequelize = require('../sequelize').default
var Vendor = sequelize.model('Vendor')

var services = require('../openprices-services')
var Products = services.products
var Vendors = services.vendors

export function getVendors(req, res, next) {
    Vendor.all().then(vendors => {
        return vendors.map(VendorModelInterface)
    }).then(data => {
        res.json({
            data
        })
    }).catch(err => {
        next(err)
    })
}
export function getVendor(req, res, next) {
    var { id } = req.params
    Vendor.findById(id).then(VendorModelInterface).then(data => {
        res.json({
            data
        })
    })
}

function ProductModelInterface(p) { return ProductInterface(p.get()) }
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
function VendorModelInterface(v) { return VendorInterface(v.get()) }
function VendorInterface(v) {
    var obj = {
        id : v.id,
        code: v.code,
        name: v.name,
        address: v.address
    }
    return obj
}
function PriceModelInterface(pr) { return PriceInterface(pr.get()) }
function PriceInterface(pr) {
    var obj = {
        price: pr.price,
        date: pr.date,
        vendor: pr.VendorId,
        user: pr.UserId
    }
    return obj
}