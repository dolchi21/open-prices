var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('../public'));



var seneca = require('./seneca-client')



app.use('/api', require('./routes/api'))
app.use(require('./routes/services'))

app.use('/user', require('./lib/jwt').middleware(), (req, res, next) => {
    res.json({
        data : req.user
    })
})

app.get('/members', (req, res, next) => {

    var jsonwebtoken = require('jsonwebtoken')

    var store = require('./stores/variables').default

    var json = {
        data: jsonwebtoken.decode(req.cookies.accessToken),
        store: store.get()
    }

    res.json(json)

})

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json(err);
});

(function printRoutes(app) {
    //require('express-print-routes')(app, './routes.txt');
})(app);

module.exports = app;