;(function(factory){
	if (typeof module === 'object' && typeof exports === 'object') {
		module.exports = factory( require('./axios.min.js'), require('./EventEmitter.min.js'), require('./util.js') );
	} else {
		window.I18n = factory(axios, EventEmitter, util);
		window.i18n = new window.I18n();
	}
})(function I18nFactory(axios, EventEmitter, util){
	/**
	* @class I18n
	*/
	function I18n(){
		var self = this;
		this.instanceOf = arguments.callee.name;

		this._data = {}
		this._language = navigator.language.substr(0,2) || 'es';
		this._baseURL = '/i18n/';

		/**
		* Returns loaded JSON.
		* @memberof I18n#
		* @returns {Object} data Loaded JSON
		*/
		function data(){
			return self._data;
		}

		/**
		* Load JSON data into instance. Use before requesting traductions.
		* @memberof I18n#
		* @param {Object} json JSON to be loaded
		* @returns {I18n} self
		*/
		function load(value){
			self._data = value;
			return self;
		}

		/**
		* Same as {@link I18n#load} but does not overwrite all data. It merges it.
		* @memberof I18n#
		* @param {Object} json JSON to be loaded
		* @returns {I18n} self
		*/
		function add(value){
			for (var i in value) {
				self._data[i] = value[i];
			}
			return self;
		}

		/**
		* Set or get instance language.
		* @memberof I18n#
		* @param {string|undefined} value (es, en, it, etc)
		* @returns {I18n|string} self|language
		* @fires I18n#language
		*/
		function language(value){
			if (value === undefined) {
				return self._language;
			} else {
				if (self.emit) {
					self.emit('language', {
						new : value,
						old : language()
					});
				}
				self._language = value;
				return self;
			}
		}

		/**
		* Returns the traduction for key.
		* @memberof I18n#
		* @param {string} key Key as in json
		* @returns {string} text
		*/
		function get(key){
			if (!self._data[key]) { return key; }
			if (!self._data[key][self._language]) {
				
				if (!self._data[key]['es']) { return key; }
				else { return self._data[key]['es']; }

			} else {
				return self._data[key][self._language];
			}
		}

		function loadURL(value){
			var urls = []
			if (Array.isArray(value)) {
				urls = value;
			} else {
				urls.push(value);
			}
			var ps = urls.map(function(url){
				if (url.indexOf('.json') == -1) {
					url = url + '.json';
				}
				return axios.get(self._baseURL + url).then(function(response){
					add(response.data);
					language( language() );
					return self;
				});
			});
			return Promise.all(ps);
		}



		this.data = data;
		this.load = load;
		this.loadURL = loadURL;
		this.add = add;

		this.language = language;
		this.get = get;

		EventEmitter.call(this);
	}
	util.inherits(I18n, EventEmitter);

	return I18n;

});
