var crypto = require('crypto');
var hmac = crypto.createHmac('md5', '').update().digest('hex');

module.exports = function md5(str){
	return hmac.update(str).digest('hex');
}