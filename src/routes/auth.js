var express = require('express')
var router = express.Router()

var sequelize = require('../sequelize').default
var User = sequelize.model('User')


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

        var jwt = Date.now()

        res.cookie('accessToken', jwt, {
            httpOnly: true,
            maxAge: 1000 * 60 * 20
        })

        res.json({
            data: user.get()
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

router.use('/users', verifyAccessToken)
router.get('/users', (req, res, next) => {
    User.all().then(users => {
        res.json({
            data: users.map(u => u.get())
        })
    })
})

router.post('/register', (req, res, next) => {

    var { username, password } = req.body

    User.create({
        username, password
    }).then(user => {
        res.json({
            data: user.get()
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
