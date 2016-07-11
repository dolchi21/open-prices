mysql -uroot -pdugtgz <<< "DROP DATABASE IF EXISTS open_prices"
mysql -uroot -pdugtgz <<< "CREATE DATABASE open_prices"

node sequelize.js
node populate.js
node populate-prices.js
node bin/www
