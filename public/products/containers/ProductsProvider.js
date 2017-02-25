'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _products = require('../stores/products.js');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.store = _products2.default;

function ProductsProvider(Component) {
    return _react2.default.createClass({
        getInitialState: function getInitialState() {
            return {};
        },
        render: function render() {
            var products = _products2.default.getProducts();
            var props = Object.assign({}, {
                products: products
            });
            console.log(props);
            return _react2.default.createElement(Component, props);
        },
        componentWillMount: function componentWillMount() {
            _products2.default.on('change', this._update);
        },
        _update: function _update() {
            this.setState({});
        }
    });
}

exports.default = ProductsProvider;