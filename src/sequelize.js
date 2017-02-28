import { connection } from 'database-models'

var sequelize = connection({
    logging: null
})

export default sequelize

;(function(run){
    if (!run) return
    if (!process.argv[2]) return

    var sql = 'ALTER TABLE "Products" ADD COLUMN name TEXT'
    var sql = 'SELECT * FROM "Products" LIMIT 10'
    var sql = 'SELECT "name", COUNT(1) as "c" FROM "ProductNames" WHERE "ProductId"=6 GROUP BY "name" ORDER BY "c" DESC'
    

    var sql = 'SELECT * FROM "ProductNames" as pn JOIN "Products" as p ON pn."ProductId"=p.id;'
    var sql = 'SELECT p.id, pn.name, COUNT(1) as c FROM "ProductNames" as pn JOIN "Products" as p ON pn."ProductId"=p.id WHERE p.barcode=:barcode GROUP BY p.id, pn.name ORDER BY c DESC'

    sequelize.query(sql, {
        replacements : {
            barcode : '7796613011764'
        }
    }).then(function([rs, meta]){
        console.log(rs)
    }).catch(err=>{
        console.log(err)
        console.log(err.name)
    })

    sequelize.models.Product.findOne()

})(require.main === module);
