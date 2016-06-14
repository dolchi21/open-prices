var ProductList = React.createClass({
	displayName: "ProductList",

	getInitialState: function () {
		return {
			products: []
		};
	},
	componentDidMount: function () {
		var self = this;
		Product.all().then(function (products) {
			self.setState({
				products: products
			});
		});
	},
	render: function render() {
		var products = this.state.products;
		return React.createElement(
			"div",
			null,
			React.createElement(
				"ul",
				{ className: "list-group" },
				products.map(function (product) {
					return React.createElement(
						"li",
						{ className: "list-group-item", key: 'item-' + product.barcode() },
						React.createElement(ProductList.Item, { product: product })
					);
				})
			)
		);
	}
});

ProductList.Item = React.createClass({
	displayName: "Item",

	componentDidMount: function componentDidMount() {
		var self = this;
		Product.find(this.props.product.barcode()).then(function (product) {
			self.props.product.setData(product.getData());
			self.forceUpdate();
		});
	},
	render: function render() {
		var product = this.props.product;
		return React.createElement(
			"div",
			{ className: "media" },
			React.createElement(
				"div",
				{ className: "media-left" },
				React.createElement(
					"div",
					{ className: "media-object text-align", style: { 'border': '1px solid', 'fontSize': '2rem', 'width': '5rem', 'padding': '1rem' } },
					React.createElement("i", { className: "fa fa-list" })
				)
			),
			React.createElement(
				"div",
				{ className: "media-body" },
				React.createElement(
					"div",
					{ className: "media-heading", title: JSON.stringify(product.json(), null, 2) },
					product.barcode()
				),
				React.createElement(ProductList.Item.Prices, { prices: product.prices() })
			)
		);
	}
});

ProductList.Item.Prices = React.createClass({
	displayName: "Prices",

	render: function render() {
		var prices = this.props.prices;
		var id = 0;
		return React.createElement(
			"div",
			null,
			React.createElement(
				"table",
				{ className: "table" },
				React.createElement(
					"tbody",
					null,
					prices.map(function (price) {
						return React.createElement(ProductList.Item.Prices.Price, { price: price, key: id++ });
					})
				)
			)
		);
	}
});

ProductList.Item.Prices.Price = React.createClass({
	displayName: "Price",

	render: function render() {
		var price = this.props.price;
		return React.createElement(
			"tr",
			null,
			React.createElement(
				"td",
				null,
				"$ ",
				price.price
			),
			React.createElement(
				"td",
				null,
				moment(price.date).format('YYYY-MM-DD')
			),
			React.createElement(
				"td",
				null,
				price.vendor.name
			)
		);
	}
});