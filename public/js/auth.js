;(function(factory){

	if (typeof module === 'object' && typeof exports === 'object') {

		var Auth = factory( require('./axios.min.js') );
		module.exports = new Auth();

	} else {

		var Auth = factory(axios);
		window.Auth = new Auth();

	}


})(function AuthFactory(axios){

	function Auth(){

		self._baseUrl = '/api';

		function getToken(username, password){
			return axios.post('/api/auth/token', {
				username : username,
				password : password
			}).then(function(response){
				return response.data.token;
			});
		}
		function login(username, password){
			return getToken(username, password).then(function(token){
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
				return token;
			});
		}
		function getProtected(){
			return new Promise(function(resolve, reject){
				return $.getJSON('/api/auth/protected').done(function(data){
					resolve(data);
				});
			});
		}

		this.getToken = getToken;
		this.login = login;
		this.getProtected = getProtected;

	}


	return Auth;

});