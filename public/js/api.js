(function(){
	
	function API(){}
	
	API.report = function report(data){
		return axios.post('/api/reports/', data);
	}

	window.API = API;

})();