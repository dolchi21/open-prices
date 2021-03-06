import React from 'react'
import ReactDOM from 'react-dom'

import ProductForm from './components/ProductForm.js'
import ProductsList from './components/ProductsList.js'

var App = (props) => {
    return (
        <div>
            <div>App</div>
            <div>
                <ProductForm />
            </div>
            <div>
                <ProductsList />
            </div>
        </div>
    )
}

export default App

export function mount(id = 'app') {
    var el = document.getElementById(id)
    ReactDOM.render(<App />, el)
}
