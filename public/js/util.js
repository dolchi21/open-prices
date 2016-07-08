;(function(Util){
	
	if (typeof module === 'object' && typeof exports === 'object') {

		module.exports = Util();

	} else {

		window.util = Util();

	}

})(function Util(){
	
	function inherits (ctor, superCtor) {
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	}
	return { inherits : inherits }

});