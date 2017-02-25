import EventEmitter from 'events'
import * as API from '../api.js'

class ProductsStore extends EventEmitter {

    constructor() {
        super()
        this.products = []
        this.productsByBarcode = {}
        this.loading = function (bool) {
            if (bool === undefined) return this._loading
            this._loading = !!bool
            this.emitChange()
        }.bind(this)
    }

}
ProductsStore.prototype.emitChange = function emitChange() { this.emit('change') }
ProductsStore.prototype.addProduct = function addProduct(product) {

    var { barcode } = product

    if (this.products.indexOf(barcode) === -1) {
        this.products.push(barcode)
    }

    this.productsByBarcode[barcode] = product

}
ProductsStore.prototype.getProducts = function getProducts() {
    return this.products.map(barcode => this.productsByBarcode[barcode])
}
ProductsStore.prototype.load = function load() {
    this.loading(true)
    return API.getProducts().then(products => {
        products.map(p => this.addProduct(p))
        this.loading(false)
        products.map(({barcode}) => {
            this.loadProduct(barcode)
        })
    })
}
ProductsStore.prototype.loadProduct = function loadProduct(barcode) {
    this.loading(true)
    return API.getProduct(barcode).then(product => {
        return API.getProductPrice(barcode).then(price => {
            product.price = price
            this.addProduct(product)
            this.loading(false)
        })
    })
}

var store = new ProductsStore()

store.load()

export default store
