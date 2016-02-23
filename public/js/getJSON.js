function getJSON(url){
	return new Promise(function(resolve, reject){
		$.getJSON(url).done(function(data, status, xhr){
			resolve(data);
		});
	});
}