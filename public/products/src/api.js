import axios from 'axios'

export function getProducts(){
    return axios.get('/api/products').then(response => response.data.data)
}

export function getProduct(barcode){
    return axios.get('/api/products/' + barcode).then(response => response.data.data)
}

export function getProductPrice(barcode){
    return axios.get('/api/products/' + barcode + '/price').then(response => response.data.data)
}
