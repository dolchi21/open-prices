;(function(SystemJS){
	SystemJS.config({
		map : {
			accounting : '/js/accounting.min.js',
			alertify : '/js/alertify/alertify.min.js',
			axios : '/node_modules/axios/dist/axios.min.js',
			bluebird : '/js/bluebird-3.4.1.js',
			bootstrap : '/bootstrap-3.3.5/css/bootstrap.min.css',
			Chartjs : '/node_modules/chart.js/Chart.js',
			classnames : '/node_modules/classnames/index.js',
			css : '/node_modules/systemjs-plugin-css',
			events : '/js/EventEmitter.min.js',
			'font-awesome' : '/font-awesome-4.5.0/css/font-awesome.min.css',
			less : '/node_modules/systemjs-plugin-less',
			lesscss : '/node_modules/less',
			moment : '/js/moment-with-locales.min.js',
			'node-uuid' : '/node_modules/node-uuid/uuid.js',
            'react' : '/node_modules/react/dist/react.min.js',
			'react-dom' : '/node_modules/react-dom/dist/react-dom.min.js',
			
			'react-redux' : '/node_modules/react-redux/dist/react-redux.min.js',
			redux : '/node_modules/redux/dist/redux.min.js',
			'redux-logger' : '/node_modules/redux-logger/dist/index.min.js',
			'redux-thunk' : '/node_modules/redux-thunk/dist/redux-thunk.min.js',
			store : '/node_modules/store/store.js',
			util : '/js/util.js'
		},
		meta : {
			'*.css' : { loader : 'css' },
			'*.less' : { loader : 'less' }
		},
		packages: {
			lesscss: {
				main: {
					browser: './dist/less.min.js',
					node: '@node/less'
				}
			},
			css: { main: 'css.js' },
			less: { main: 'less.js' }
		}
	});
})(SystemJS);