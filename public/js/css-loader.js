
(function(factory){
	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory( require('./axios.min.js') );
	} else {
		window.CSSLoader = factory(axios);
	}
})(function CSSLoaderFactory(axios){

	function CSSLoader(){

		var self = this;
		
		this._baseURL = '/css/';

		function require(css){
			var url = this._baseURL + css + '.css';
			return axios.get(url).then(function(response){

				remove(css);

				var style = document.createElement('style');
				style.id = css;
				style.type = 'text/css';
				style.innerHTML = response.data;
				document.head.appendChild(style);

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
	return CSSLoader;

});
