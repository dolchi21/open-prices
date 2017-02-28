import React from 'react'
import axios from 'axios'

import store from '../stores/products.js'

var ProductForm = React.createClass({
    getInitialState: () => ({}),
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChange} name="barcode" placeholder="barcode" />
                <input onChange={this.handleChange} name="name" placeholder="name" />
                <button type="submit">Send</button>
            </form>
        )
    },
    handleSubmit(ev) {
        ev.preventDefault()
        axios.post('/api/products', this.state).then(() => {
            store.loadProduct(this.state.barcode)
        })
    },
    handleChange(ev) {
        var { name, value } = ev.target
        this.setState({
            [name]: value
        })
    }
})

export default ProductForm
