;(function(factory){
	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory( require('./axios.min.js'), require('./EventEmitter.min.js'), require('./util.js') );
	} else {
		window.Product = factory(axios, EventEmitter, util);
	}
})(function ProductFactory(axios, EventEmitter, util){

	function Product(){
		var self = this;
		
		var attr = {
			barcode : null,
			prices : []
		}
		{
			function setData(value){
				attr = value;
				return self;
			}
			function getData(){
				return attr;
			}
		}

		function barcode(value){
			if (value === undefined) {
				return attr['barcode'];
			}
			attr['barcode'] = value;
			return self;
		}

		function name(value){
			if (value === undefined) {
				return attr.name;
			}
			attr.name = value;
			return self;
		}

		function prices(value){
			if (value === undefined) {
				return attr['prices'];
			}
			attr['prices'] = value;
			return self;
		}

		function addPrice(price, vendor, date){
			return Product.addPrice(barcode(), price, vendor, date);
		}

		function create () {
			return Product.create({
				barcode : barcode(),
				name : name()
			});
		}

		function json(){
			return {
				barcode : barcode(),
				name : name(),
				prices : prices()
			}
		}

		{	/* INTERFACE */
			this.barcode = barcode;
			this.name = name;
			this.prices = prices;
			
			this.addPrice = addPrice;
			
			this.create = create;

			this.json = json;
			this.setData = setData;
			this.getData = getData;
		}
		
		EventEmitter.call(this);
	}
	Product.find = function find(barcode){
		return axios('/api/products/' + barcode).then(function(response){

			var data = response.data;

			var product = new Product();
			product.barcode(data.barcode);
			product.prices(data.prices);
			return product;

		});
	}
	Product.all = function all(){
		return axios.get('/api/products').then(function(response){

			var products = response.data;
			return products.map(function(data){
				var product = new Product();
				product.barcode( data.barcode );
				return product;
			});

		});
	}
	Product.create = function create (data) {
		return new Promise(function(resolve, reject){	
			$.post('/api/products/', data, function(data, status, xhr){
				resolve(data);
			}).fail(function(xhr){
				reject( xhr.responseJSON );
			});
		});
	}
	Product.addPrice = function addPrice (barcode, price, vendor, date) {
		return new Promise(function(resolve, reject){
			var ep = '/api/products/'+barcode+'/prices';
			var form_data = {
				price : price,
				vendor : vendor,
				date : date
			}
			$.post(ep, form_data, function(data, status, xhr){
				resolve(data);
			}).fail(function(xhr){
				reject( xhr.responseJSON );
			});
		});
	}

	util.inherits(Product, EventEmitter);

	return Product;

});
