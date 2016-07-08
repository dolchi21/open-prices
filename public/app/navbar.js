(function Nav() {

	var Nav = React.createClass({
		displayName: "Nav",

		render: function () {
			var self = this;
			return React.createElement(
				"nav",
				{ className: "navbar navbar-inverse" },
				React.createElement(
					"div",
					{ className: "container-fluid" },
					React.createElement(
						"div",
						{ className: "navbar-header" },
						React.createElement(Brand, null)
					),
					React.createElement(
						"ul",
						{ className: "nav navbar-nav navbar-right" },
						React.createElement(
							"li",
							{ className: "dropdown" },
							React.createElement(
								"a",
								{ className: "dropdown-toggle", "data-toggle": "dropdown", href: "#" },
								React.createElement(
									Text,
									{ i18n: "language" },
									" "
								),
								React.createElement("i", { className: "fa fa-caret-down" })
							),
							React.createElement(
								"ul",
								{ className: "dropdown-menu" },
								['es', 'en'].map(function (language, i) {
									return React.createElement(
										"li",
										{ key: i },
										React.createElement(
											"a",
											{ href: '#/' + language, onClick: self.changeLanguage, "data-language": language },
											language
										)
									);
								})
							)
						)
					)
				)
			);
		},
		changeLanguage: function changeLanguage(ev) {
			//ev.preventDefault()
			i18n.language(ev.target.dataset.language);
		}
	});

	var Brand = React.createClass({
		displayName: "Brand",

		render: function () {
			return React.createElement(
				"a",
				{ className: "navbar-brand", href: "#" },
				React.createElement(
					"span",
					{ className: "text-white text-bold text-3rem" },
					"OpenPrices"
				),
				React.createElement(
					"span",
					{ className: "text-white text-bold text-cursive" },
					".org"
				)
			);
		}
	});
	var BrandMario = React.createClass({
		displayName: "BrandMario",

		render: function () {
			var img_style = {
				height: '50px',
				marginRight: '-10px',
				marginTop: '-15px',
				display: 'inline'
			};
			return React.createElement(
				"a",
				{ className: "navbar-brand", href: "#" },
				React.createElement("img", { src: "//10.8.0.18/favicons/mario_coin.gif", style: img_style }),
				React.createElement(
					"span",
					{ className: "text-white text-bold text-3rem" },
					"penPrices"
				),
				React.createElement(
					"span",
					{ className: "text-white text-bold text-cursive" },
					".org"
				)
			);
		}
	});

	var Text = React.createClass({
		displayName: "Text",

		componentWillMount: function componentWillMount() {},
		componentDidMount: function () {
			var self = this;

			if (!i18n.on) {
				return;
			}

			i18n.on('language', function () {
				if (self.isMounted()) {
					self.forceUpdate();
				}
			});
		},
		render: function render() {
			var value = this.getValue(this.props.i18n);
			return React.createElement(
				"span",
				this.props,
				value,
				this.props.children
			);
		},
		getValue: function getValue(key) {
			return i18n.get(key);
		}
	});

	ReactDOM.render(React.createElement(Nav, null), document.getElementById('nav'));
})();