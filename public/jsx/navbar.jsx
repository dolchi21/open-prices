(function Nav(){
	
	var Nav = React.createClass({
		render : function(){
			var self = this;
			return (
				<nav className="navbar navbar-inverse">
					<div className="container-fluid">
						<div className="navbar-header">
							<Brand />
						</div>
						<ul className="nav navbar-nav navbar-right">
							<li className="dropdown">
								<a className="dropdown-toggle" data-toggle="dropdown" href="#">
									<Text i18n="language"> </Text>
									<i className="fa fa-caret-down"></i>
								</a>
								<ul className="dropdown-menu">
									{['es', 'en'].map(function(language, i){
										return (
											<li key={i}><a href={'#/'+language} onClick={self.changeLanguage} data-language={language}>{language}</a></li>
											);
									})}
								</ul>
							</li>
						</ul>
					</div>
				</nav>
				);
		},
		changeLanguage : function changeLanguage(ev) {
			//ev.preventDefault()
			i18n.language( ev.target.dataset.language );
		}
	});

	var Brand = React.createClass({
		render : function () {
			return (
				<a className="navbar-brand" href="#">
					<span className="text-white text-bold text-3rem">OpenPrices</span>
					<span className="text-white text-bold text-cursive">.org</span>
				</a>
				);
		}
	});
	var BrandMario = React.createClass({
		render : function () {
			var img_style = {
				height : '50px',
				marginRight : '-10px',
				marginTop : '-15px',
				display : 'inline'
			}
			return (
				<a className="navbar-brand" href="#">
					<img src="//10.8.0.18/favicons/mario_coin.gif" style={img_style}></img>
					<span className="text-white text-bold text-3rem">penPrices</span>
					<span className="text-white text-bold text-cursive">.org</span>
				</a>
				);
		}
	});

	var Text = React.createClass({
		componentWillMount : function componentWillMount(){},
		componentDidMount : function(){
			var self = this;
			
			if (!i18n.on) { return; }

			i18n.on('language', function(){
				if ( self.isMounted() ) {
					self.forceUpdate();
				}
			});
		},
		render : function render() {
			var value = this.getValue(this.props.i18n);
			return (<span {...this.props}>{value}{this.props.children}</span>);
		},
		getValue : function getValue (key) {
			return i18n.get(key);
		}
	});

	ReactDOM.render(<Nav/>, document.getElementById('nav'));

})();