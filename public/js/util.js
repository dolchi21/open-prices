(function(window){

	function Util () {
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
		this.inherits = inherits;
	}

	var util = new Util();
	window.util = util;

})(window);
