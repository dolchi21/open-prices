(function(window){

	function Util () {
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
		return new Util();
	}
	var util = Util();
	window.util = util;
})(window);

function callApplyBind(){
	var obj = {
		num : 2
	}

	function addToThis(a){
		this.num += a;
		return this;
	}

	var res = addToThis.call(obj, 2);
	console.log(obj, res);
}