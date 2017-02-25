'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mount = mount;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ProductsList = require('./components/ProductsList.js');

var _ProductsList2 = _interopRequireDefault(_ProductsList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(props) {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            'div',
            null,
            'App'
        ),
        _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_ProductsList2.default, null)
        )
    );
};

exports.default = App;
function mount() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'app';

    var el = document.getElementById(id);
    _reactDom2.default.render(_react2.default.createElement(App, null), el);
}