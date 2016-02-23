var request = require('request');

function AFIP(){

	function persona(cuit){
		var ep = 'https://soa.afip.gob.ar/sr-padron/v2/persona/' + cuit;
		return new Promise(function(resolve, reject){

			request({
				url : ep,
				rejectUnauthorized : false
			}, function(err, response, body){
				if (err) { return reject(err); }
				
				var json = JSON.parse(body);
				
				if (json.success) {
					
					var persona = new Persona(json.data);

					return resolve(persona);
				} else {
					return reject(json.error);
				}
			});

		});
	}

	this.persona = persona;

}
function Persona(data){
	var afip_data = data;

	function code(){
		return data.idPersona;
	}
	function name(){
		return data.nombre;
	}
	function address(){
		var a = null;
		if (data.domicilioFiscal) {
			if (data.domicilioFiscal.direccion) {
				a = data.domicilioFiscal.direccion;
			}
			if (a && data.domicilioFiscal.localidad) {
				a += ', ' + data.domicilioFiscal.localidad;
			}
		}
		return a;
	}
	
	this.code = code;
	this.name = name;
	this.address = address;
}


(function(AFIP){

	var afip = new AFIP();
	module.exports = afip;
	require('util').log('AFIP', 'ready');

})(AFIP);