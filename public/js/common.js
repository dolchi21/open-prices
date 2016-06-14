(function(){

	(function Session() {
		
		if (store.get('token')) {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.get('token');
		}

	})()

})()