var REACT = REACT || {}

REACT.Product = React.createClass({
	displayName : 'Product',
	getInitialState : function () {
		var self = this;
		var state = {}
		state.product = new Product();

		//if (this.props.barcode) {
			Product.find( this.props.barcode || 7622300847210 ).then(function(product){
				self.state.product = product;
				self.forceUpdate();
			}).catch(function(err){
				toastr.error(err.err);
			});
		//}

		return state;
	},
	handleBlur : function (event) {
		var value = event.target.value;
		Product.find(value).then(function(product){
			this.state.product = product;
			this.forceUpdate();
		});
	},
	render : function(){
		window.component = this;
		return (
			<div className="product">
				<div className="panel">
					<div className="panel-heading">
						<h3 className="panel-title">
							<span>
								<img src="/favicon.ico"></img>
							</span>
							<span> Product</span>
							<div className="pull-right" style={{ width : '15rem' }}>
								<ProductSelect/>
							</div>
						</h3>
					</div>
					<div className="panel-body">
						<form className="form-horizontal" >
							<ProductBarcode product={this.state.product}/>
							<ProductName product={this.state.product}/>
						</form>
					</div>
				</div>
			</div>
		);
	}
});

var ProductName = React.createClass({
	handleBlur : function (event) {
		var value = event.target.value;
		this.props.product.name( value );
		this.forceUpdate();
	},
	render : function () {
		var product = this.props.product;
		return (
			<div className="form-group">
				<label className="col-sm-3 control-label">Name</label>
				<div className="col-sm-7">
					<input className={['form-control']} defaultValue={product.name()} onBlur={this.handleBlur} placeholder={product.name()}/>
					<span className="help-block">{product.name()}</span>
				</div>
				<div className="col-sm-2">
				</div>
			</div>
		);
	}
});
var ProductBarcode = React.createClass({
	handleBlur : function (event) {
		var value = event.target.value;
		this.props.product.barcode( value );
		this.forceUpdate();
	},
	render : function () {
		var product = this.props.product;
		return (
			<div className="form-group">
				<label className="col-sm-3 control-label">Barcode</label>
				<div className="col-sm-7">
					<input className="form-control" defaultValue={product.barcode()} onBlur={this.handleBlur} placeholder={product.barcode()}/>
					<span className="help-block">{product.barcode()}</span>
				</div>
				<div className="col-sm-2">
					<button className="btn" onClick={this.loadProduct}>Load</button>
				</div>
			</div>
		);
	},
	loadProduct : function loadProduct(event){ event.preventDefault(); }
});
var ProductSelect = React.createClass({
	getInitialState : function getInitialState(){
		var self = this;
		this.getBarcodes().then(function(barcodes){
			self.setState({
				barcodes : barcodes
			});
		});
		return { barcodes : [] }
	},
	render : function render(){
		return (
			<div>
				<input className="form-control" onChange={this.handleChange} list={'dl-' + this._reactInternalInstance._rootNodeID}/>
				<datalist id={'dl-' + this._reactInternalInstance._rootNodeID}>
					{this.state.barcodes.map(function(barcode){
						return (<option value={barcode}>{barcode}</option>);
					})}
				</datalist>
			</div>
		);
	},
	getBarcodes : function getBarcodes(search){
		return new Promise(function(resolve, reject){
			Product.all().then(function(products){
				var barcodes = products.map(function(p){
					return p.barcode();
				});
				resolve( barcodes );
			});
		});
	}
});
function Form(){}
Form.noSubmit = function(ev){
	ev.preventDefault();
	return false;
}

ReactDOM.render( React.createElement(REACT.Product), document.getElementById('product') );
