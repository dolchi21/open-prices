(function () {

	var Profile = React.createClass({
		displayName: "Profile",

		render: function () {
			var user = this.props.user;
			return React.createElement(
				"div",
				{ className: "panel panel-primary" },
				React.createElement(
					"div",
					{ className: "panel-body" },
					React.createElement(UserDataList, { user: user })
				)
			);
		}
	});
	var UserDataList = React.createClass({
		displayName: "UserDataList",

		render: function render() {
			var user = this.props.user;
			return React.createElement(
				"ul",
				null,
				React.createElement(
					"li",
					null,
					user.id()
				),
				React.createElement(
					"li",
					null,
					user.username()
				),
				React.createElement(
					"li",
					null,
					user.jti()
				)
			);
		}
	});

	window.Profile = Profile;

	window.React.init = function () {
		User.load().then(function (user) {
			ReactDOM.render(React.createElement(Profile, { user: user }), document.getElementById('profile'));
		});
	};
})();