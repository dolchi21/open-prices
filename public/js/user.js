;(function(root, factory){

	if (typeof module === 'object' && typeof exports === 'object') {

		module.exports = factory(require('./axios.min.js'), require('./store.min.js'));

	} else {

		window.User = factory(axios, store);

	}

})(this, function UserFactory(axios, store){

	function User(data){

		var self = this;

		self._dataValues = {}

		function set(key, value){
			self._dataValues[key] = value;
			return self;
		}
		function get(key){
			if (key === undefined) {
				return self._dataValues;
			}
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
		function save(){
			return User.save(self);
		}

		this.username = username;
		this.id = id;
		this.jti = jti;

		this.json = json;
		this.save = save;

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
		return axios.get('/api/user', {
			headers : { Authorization : 'Bearer ' + store.get('token') }
		}).then(function(response){
			var user = new User(response.data);
			return user;
		});
	}
	User.save = function save(user){
		return axios.put('/api/user', user.get(), {
			headers : { Authorization : 'Bearer ' + store.get('token') }
		});
	}
	User.prices = function(){
		return axios.get('/api/user/prices', {
			headers : { Authorization : 'Bearer ' + store.get('token') }
		}).then(function(response){
			return response.data;
		});
	}
	User.register = function register(username, password){
		return axios.post('/api/auth/register', {
			username: username,
			password : password
		});
	}

	return User;
	
});
