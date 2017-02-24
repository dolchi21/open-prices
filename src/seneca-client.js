var seneca = require('seneca')({
    tag: 'webapi-client',
    log: 'silent'
}).use('mesh').ready(function(){
    console.log('ready %s', this.id)
})

module.exports = seneca
