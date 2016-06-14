(function ReportJS() {

	window.addEventListener('unhandledrejection', function(err){
		report({
			reason : (function(reason){
				if (reason instanceof Error) {
					return {
						name : reason.name,
						message : reason.message,
						stack : reason.stack
					}
				}
				if (typeof reason == 'object') {
					return reason;
				}
			})(err.reason),
			timestamp : err.timestamp,
			type : err.type,
		});
	});

	window.addEventListener('error', function(err){
		report({
			column : err.colno,
			error : {
				name : err.error.name,
				message : err.error.message
			},
			filename : err.filename,
			line : err.lineno,
			message : err.message,
			timestamp : err.timestamp,
			type : err.type,
		});
	});

	function report(data){
		return axios.post('/api/reports/', data);
	}

})();