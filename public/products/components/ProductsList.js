'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ProductsProvider = require('../containers/ProductsProvider.js');

var _ProductsProvider2 = _interopRequireDefault(_ProductsProvider);

var _UI = require('./UI.js');

var _products = require('../stores/products.js');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductsList = _react2.default.createClass({
    displayName: 'ProductsList',
    render: function render() {
        var products = this.props.products;

        return _react2.default.createElement(
            _UI.List,
            null,
            products.map(function (p) {
                return _react2.default.createElement(
                    _UI.ListItem,
                    { onClick: _products2.default.loadProduct.bind(_products2.default, p.barcode) },
                    _react2.default.createElement(Product, p)
                );
            })
        );
    }
});

exports.default = (0, _ProductsProvider2.default)(ProductsList);


function Product(props) {
    return _react2.default.createElement(
        'div',
        { className: 'row' },
        _react2.default.createElement(
            'div',
            { className: 'col-xs-4' },
            props.barcode
        ),
        _react2.default.createElement(
            'div',
            { className: 'col-xs-4' },
            props.name
        ),
        _react2.default.createElement(
            'div',
            { className: 'col-xs-4' },
            props.price
        )
    );
}