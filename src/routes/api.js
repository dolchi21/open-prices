var express = require('express')
var router = express.Router()

var sequelize = require('../sequelize').default

var auth = require('./auth')
router.use('/auth', auth)

router.get('/user', require('../lib/jwt').middleware(), (req, res, next) => {
    res.json({
        data: req.user
    })
})

var products = require('./products')
router.use('/products', products)

var vendors = require('./vendors')
router.use('/vendors', vendors)


router.delete('/prices/:id', require('../lib/jwt').middleware(), (req, res, next) => {

    var Price = sequelize.model('Price')

    var user = req.user.data
    var id = parseInt(req.params.id)

    Price.destroy({
        where: {
            id,
            UserId: user.id
        }
    }).then(() => {
        res.json({
            success: true
        })
    }).catch(next)

})


router.get('/users/:id', function (req, res, next) {
    var User = sequelize.model('User')
    User.findById(req.params.id).then(user => {
        res.json({
            data: UserModelInterface(user)
        })
    })
})

var productsController = require('../controllers/products')
router.get('/user/products', require('../lib/jwt').middleware())
router.get('/user/products', productsController.getUserProducts)


module.exports = router

var UserInterface = u => ({
    id: u.id,
    username: u.username
})
var UserModelInterface = u => UserInterface(u.get())
