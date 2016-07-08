(function(factory){

	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = new factory( require('./axios.min.js') )();
	} else {
		window.JSLoader = new factory(axios)();
	}

})(function JSLoader(axios){

	function JSLoader(){

		var self = this;
		
		this._baseURL = '/js/';

		function require(js){
			var url = this._baseURL + js + '.js';
			return axios.get(url).then(function(response){

				remove(js);

				var script = document.createElement('script');
				script.id = js;
				script.type = 'text/javascript';
				script.innerHTML = response.data;
				document.head.appendChild(script);

			});
		}

		function remove(id){
			var head_elements = document.head.children;

			for (var i = 0; i < head_elements.length; i++) {
				
				var el = head_elements.item(i);
				(el.id == id) ? el.remove() : null;

			}
			return self;
		}

		this.require = require;
		this.remove = remove;

	}

	return JSLoader;

});