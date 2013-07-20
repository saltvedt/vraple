
$(function(){
	window.App = {
		Router: {}
	};

	App.Router = Backbone.Router.extend({
		routes: {
			'': 'index',
			'q=:query': 'search'
		},

		index: function() {
			//this is were we display the info on the main page
		},

		search: function(query) {
			//parse the query and determine what search engine to send the user to
		}
	});

	new App.Router();
	Backbone.history.start();
});
