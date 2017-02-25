import React from 'react'
import store from '../stores/products.js'

window.store = store

function ProductsProvider(Component) {
    return React.createClass({
        getInitialState: () => ({}),
        render() {
            var products = store.getProducts()
            var props = Object.assign({}, {
                products
            })
            console.log(props)
            return <Component {...props} />
        },
        componentWillMount() {
            store.on('change', this._update)
        },
        _update() {
            this.setState({})
        }
    })
}

export default ProductsProvider
