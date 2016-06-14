var ProductList = React.createClass({
	getInitialState : function(){
		return {
			products : []
		}
	},
	componentDidMount : function(){
		var self = this;
		Product.all().then(function(products){
			self.setState({
				products : products
			});
		});
	},
	render : function render() {
		var products = this.state.products;
		return (
			<div>
				<ul className="list-group">
					{products.map(function(product){
						return (
							<li className="list-group-item" key={'item-'+product.barcode()}>
								<ProductList.Item product={product}/>
							</li>
							);
					})}
				</ul>
			</div>
			);
	}
});

ProductList.Item = React.createClass({
	componentDidMount : function componentDidMount() {
		var self = this;
		Product.find( this.props.product.barcode() ).then(function(product){
			self.props.product.setData( product.getData() );
			self.forceUpdate();
		});
	},
	render : function render() {
		var product = this.props.product;
		return (
			<div className="media">
				<div className="media-left">
					<div className="media-object text-align" style={{ 'border' : '1px solid', 'fontSize' : '2rem', 'width' : '5rem', 'padding' : '1rem' }}>
						<i className="fa fa-list"></i>
					</div>
				</div>
				<div className="media-body">
					<div className="media-heading" title={JSON.stringify(product.json(), null, 2)}>{product.barcode()}</div>
					<ProductList.Item.Prices prices={product.prices()}/>
				</div>
			</div>
			);
	}
});

ProductList.Item.Prices = React.createClass({
	render : function render() {
		var prices = this.props.prices;
		var id = 0;
		return (
			<div>
				<table className="table">
					<tbody>
					{prices.map(function(price){
						return (<ProductList.Item.Prices.Price price={price} key={id++}/>);
					})}
					</tbody>
				</table>
			</div>
			);
	}
});

ProductList.Item.Prices.Price = React.createClass({
	render : function render() {
		var price = this.props.price;
		return (
			<tr>
				<td>$ {price.price}</td>
				<td>{moment(price.date).format('YYYY-MM-DD')}</td>
				<td>{price.vendor.name}</td>
			</tr>
			);
	}
});