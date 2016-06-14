(function(){

	function User(data){
		
		var self = this;

		self._dataValues = {}

		function set(key, value){
			self._dataValues[key] = value;
			return self;
		}
		function get(key){
			return self._dataValues[key];
		}

		function username(value){
			if (value === undefined) {
				return get('username');
			}
			return set('username', value);
		}
		function id(value){
			if (value === undefined) {
				return get('id');
			}
			return set('id', value);
		}
		function jti(value){
			if (value === undefined) {
				return get('jti');
			}
			return set('jti', value);
		}

		function json(){
			return self._dataValues;
		}

		this.username = username;
		this.id = id;
		this.jti = jti;

		this.json = json;

		(function(data){

			for (var i in data) {
				if (typeof self[i] == 'function') {
					self[i](data[i]);
				} else {
					set(i, data[i]);
				}
			}

		})(data)
	}
	User.load = function load(){
		return axios.get('/api/user').then(function(response){
			var user = new User(response.data);
			return user;
		});
	}
	User.save = function save(user){
		return axios.put('/api/user', user.json());
	}
	User.prices = function(){
		return axios.get('/api/user/prices').then(function(response){
			return response.data;
		});
	}

	window.User = User;

})()