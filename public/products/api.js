'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.getProductPrice = getProductPrice;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProducts() {
    return _axios2.default.get('/api/products').then(function (response) {
        return response.data.data;
    });
}

function getProduct(barcode) {
    return _axios2.default.get('/api/products/' + barcode).then(function (response) {
        return response.data.data;
    });
}

function getProductPrice(barcode) {
    return _axios2.default.get('/api/products/' + barcode + '/price').then(function (response) {
        return response.data.data;
    });
}