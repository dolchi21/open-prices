'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _api = require('../api.js');

var API = _interopRequireWildcard(_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProductsStore = function (_EventEmitter) {
    _inherits(ProductsStore, _EventEmitter);

    function ProductsStore() {
        _classCallCheck(this, ProductsStore);

        var _this = _possibleConstructorReturn(this, (ProductsStore.__proto__ || Object.getPrototypeOf(ProductsStore)).call(this));

        _this.products = [];
        _this.productsByBarcode = {};
        _this.loading = function (bool) {
            if (bool === undefined) return this._loading;
            this._loading = !!bool;
            this.emitChange();
        }.bind(_this);
        return _this;
    }

    return ProductsStore;
}(_events2.default);

ProductsStore.prototype.emitChange = function emitChange() {
    this.emit('change');
};
ProductsStore.prototype.addProduct = function addProduct(product) {
    var barcode = product.barcode;


    if (this.products.indexOf(barcode) === -1) {
        this.products.push(barcode);
    }

    this.productsByBarcode[barcode] = product;
};
ProductsStore.prototype.getProducts = function getProducts() {
    var _this2 = this;

    return this.products.map(function (barcode) {
        return _this2.productsByBarcode[barcode];
    });
};
ProductsStore.prototype.load = function load() {
    var _this3 = this;

    this.loading(true);
    return API.getProducts().then(function (products) {
        products.map(function (p) {
            return _this3.addProduct(p);
        });
        _this3.loading(false);
        products.map(function (_ref) {
            var barcode = _ref.barcode;

            _this3.loadProduct(barcode);
        });
    });
};
ProductsStore.prototype.loadProduct = function loadProduct(barcode) {
    var _this4 = this;

    this.loading(true);
    return API.getProduct(barcode).then(function (product) {
        return API.getProductPrice(barcode).then(function (price) {
            product.price = price;
            _this4.addProduct(product);
            _this4.loading(false);
        });
    });
};

var store = new ProductsStore();

store.load();

exports.default = store;