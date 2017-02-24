import store from '../stores/variables'

var jwt = require('express-jwt')
var jsonwebtoken = require('jsonwebtoken')


store.set('jwt_secret', Math.random() + '')


export function sign(data, options = {}) {
    var secret = store.get('jwt_secret')
    return jsonwebtoken.sign(data, secret, options)
}
export function decode(jwt) {
    return jsonwebtoken.decode(jwt)
}
export function middleware(options = {}) {
    
    var opts = Object.assign({
        secret: store.get('jwt_secret'),
        getToken: req => req.cookies.accessToken
    }, options)

    return jwt(opts)

}
