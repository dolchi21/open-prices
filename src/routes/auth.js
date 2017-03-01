var express = require('express')
var router = express.Router()

var sequelize = require('../sequelize').default
var User = sequelize.model('User')


var jwt = require('../lib/jwt')
console.log(jwt)


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

        var jsonwebtoken = jwt.sign({
            data: UserModelInterface(user)
        }, { expiresIn: 60 * 20 })

        res.cookie('accessToken', jsonwebtoken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 20
        })

        res.json({
            data: jwt.decode(jsonwebtoken)
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

router.use('/users', jwt.middleware())
router.get('/users', (req, res, next) => {

    User.all().then(users => users.map(UserModelInterface)).then(users => {
        res.json({
            data: users,
            user : req.user
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
        id : user.id,
        username: user.username,
        updatedAt: user.updatedAt
    }
    return object
}
function UserModelInterface(user) {
    return UserInterface(user.get())
}