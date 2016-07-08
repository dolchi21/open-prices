(function(){

	var Profile = React.createClass({
		render : function(){
			var user = this.props.user;
			return (
				<div className="panel panel-primary">
					<div className="panel-body">
						<UserDataList user={user}/>
					</div>
				</div>
				);
		}
	});
	var UserDataList = React.createClass({
		render : function render() {
			var user = this.props.user;
			return (
				<ul>
					<li>{user.id()}</li>
					<li>{user.username()}</li>
					<li>{user.jti()}</li>
				</ul>
				);
		}
	});

	window.Profile = Profile;

	window.React.init = function(){
		User.load().then(function(user){
			ReactDOM.render(<Profile user={user}/>, document.getElementById('profile'));
		});
	}

})();