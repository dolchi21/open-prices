function API(){

	var api = '/api';
	


	function getJSON(url){
		return new Promise(function(resolve, reject){
			$.getJSON(url).done(function(data, status, xhr){
				resolve(data);
			});
		});
	}



	function randomPrice(){
		var ep = api + '/prices/random';
		return getJSON(ep);
	}
	function randomProduct(){
		var ep = api + '/products/random';
		return getJSON(ep);
	}
	function randomVendor(){
		var ep = api + '/vendors/random';
		return getJSON(ep);
	}



	function prices(){
		var ep = api + '/prices';
		return getJSON(ep);
	}
	function products(){
		var ep = api + '/products';
		return getJSON(ep);
	}
	function vendors(){
		var ep = api + '/vendors';
		return getJSON(ep);
	}

	function vendor(code){
		var ep = api + '/vendors/' + code;
		return getJSON(ep);
	}



	{	/* INTERFACE */
		this.randomPrice = randomPrice;
		this.randomProduct = randomProduct;
		this.randomVendor = randomVendor;
		
		this.prices = prices;
		this.products = products;
		this.vendors = vendors;

		this.vendor = vendor;
	}
}

var api = new API();
/*
api.vendor('30661938168');
api.vendor('20342510044');
api.vendor('30711885915');
*/