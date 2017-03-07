var seneca = require('../seneca-client')
var sequelize = require('../sequelize').default

export function createAFIPVendor(code) {
    return new Promise(function (resolve, reject) {
        seneca.act({
            SERVICE: 'AFIP',
            TYPE: 'PERSONA',
            code
        }, function (err, response) {

            if (err) return reject(err)
            if (!response.data) return reject(new Error('AFIPError'))

            var persona = response.data

            var Vendor = sequelize.models.Vendor

            return Vendor.create({
                code,
                name: persona.name
            })

        })
    })
}

export function getVendorInfo(code) {
    return new Promise(function (resolve, reject) {

        seneca.act({
            SERVICE: 'AFIP',
            TYPE: 'PERSONA',
            code
        }, function (err, response) {
            if (err) return reject(err)
            var persona = response.data
            resolve(persona)
        })

    })
}