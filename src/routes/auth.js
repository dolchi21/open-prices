var express = require('express')
var router = express.Router()

var jwt = require('express-jwt')
var jsonwebtoken = require('jsonwebtoken')

var sequelize = require('../sequelize').default
var User = sequelize.model('User')

var store = require('../stores/variables').default
store.set('jwt_secret', Math.random() + '')


router.post('/token', (req, res, next) => {

    var { username, password } = req.body

    return User.findOne({
        where: { username }
    }).then(user => {

        if (!user || !user.passwordEquals(password)) {
            var err = new Error()
            err.name = 'LoginError'
            err.message = err.name + ' invalid username/password.'
            err.status = 401
            return next(err)
        }

        var secret = store.get('jwt_secret')
        var jwt = jsonwebtoken.sign({
            data: UserModelInterface(user)
        }, secret, { expiresIn: 60 })

        res.cookie('accessToken', jwt, {
            httpOnly: true,
            maxAge: 1000 * 60 * 20
        })

        res.json({
            data: jsonwebtoken.decode(jwt)
        })

    })

})

router.get('/logout', (req, res, next) => {
    res.cookie('accessToken', null, {
        maxAge: -1
    })
    res.json({
        success: true
    })
})

router.use('/users', jwt({
    secret: store.get('jwt_secret'),
    getToken: req => req.cookies.accessToken
}))
router.get('/users', (req, res, next) => {
    User.all().then(users => users.map(UserModelInterface)).then(users => {
        res.json({
            data: users
        })
    })
})

router.post('/register', (req, res, next) => {

    var { username, password } = req.body

    User.create({
        username, password
    }).then(UserModelInterface).then(user => {
        res.json({
            data: user
        })
    })

})

module.exports = router

function verifyAccessToken(req, res, next) {

    var { accessToken } = req.cookies

    if (!accessToken) {
        var err = new AuthError('No accessToken', 401)
        return next(err)
    }

    next()

}

var AuthError = function AuthError(message, status = 401) {
    this.name = 'AuthError'
    this.message = this.name + ': ' + message
    this.status = status
}; AuthError.prototype = Error.prototype

function UserInterface(user) {
    var object = {
        username: user.username,
        updatedAt: user.updatedAt
    }
    return object
}
function UserModelInterface(user){
    return UserInterface(user.get())
}