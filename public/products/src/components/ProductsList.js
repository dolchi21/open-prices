import React from 'react'
import ProductsProvider from '../containers/ProductsProvider.js'
import { List, ListItem } from './UI.js'

import store from '../stores/products.js'

var ProductsList = React.createClass({
    render() {
        var { products } = this.props
        return (
            <List>
                {products.map(p => {
                    return (
                        <ListItem onClick={store.loadProduct.bind(store, p.barcode)}>
                            <Product {...p} />
                        </ListItem>
                    )
                })}
            </List>
        )
    }
})

export default ProductsProvider(ProductsList)

function Product(props) {
    return (
        <div className="row">
            <div className="col-xs-4">{props.barcode}</div>
            <div className="col-xs-4">{props.name}</div>
            <div className="col-xs-4">{props.price}</div>
        </div>
    )
}