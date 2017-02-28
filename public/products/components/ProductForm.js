'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _products = require('../stores/products.js');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ProductForm = _react2.default.createClass({
    displayName: 'ProductForm',

    getInitialState: function getInitialState() {
        return {};
    },
    render: function render() {
        return _react2.default.createElement(
            'form',
            { onSubmit: this.handleSubmit },
            _react2.default.createElement('input', { onChange: this.handleChange, name: 'barcode', placeholder: 'barcode' }),
            _react2.default.createElement('input', { onChange: this.handleChange, name: 'name', placeholder: 'name' }),
            _react2.default.createElement(
                'button',
                { type: 'submit' },
                'Send'
            )
        );
    },
    handleSubmit: function handleSubmit(ev) {
        var _this = this;

        ev.preventDefault();
        _axios2.default.post('/api/products', this.state).then(function () {
            _products2.default.loadProduct(_this.state.barcode);
        });
    },
    handleChange: function handleChange(ev) {
        var _ev$target = ev.target,
            name = _ev$target.name,
            value = _ev$target.value;

        this.setState(_defineProperty({}, name, value));
    }
});

exports.default = ProductForm;