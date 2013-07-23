window.onunload = function () {};

$(function () {
    window.App = {
        Router: {}
    };

    App.Router = Backbone.Router.extend({
        routes: {
            '':                                 'index',
            'q=:query':                         'vraple',
            'went_to=:search_engine&q=:query' : 'search'
        },

        index: function () {
            //this is were we display the info on the main page
        },

        vraple: function (query) {
            //parse the query and determine what search engine to send the user

            //anything with an ! in it, obviously not ideal.
            var duckduckgo = new RegExp(/!/);
            var goto_url;
            var url_data;

            if (duckduckgo.test(query)) {
                goto_url = "http://duckduckgo.com/?q=" + query;
                url_data = "went_to=duckduckgo&q=" + query;
            } else {
                goto_url = "https://www.google.com/search?q=" + query;
                url_data = "went_to=google&q=" + query;
            }

            //add the params of which search engine we're going to send the user to the history of the browser,
            //so that when the user hits the back button, we can redirect them to google.
            Backbone.history.navigate(url_data);
            window.location = goto_url;
        },

        search: function (search_engine, query) {
            //for now, every "failed" vraple goes to google
            //note that this feature will probably never work for chrome (at least not in this way) because chrome refuses to redirect
            //dont redirect to google more than once
            var goto_url;
            var url_data;
            if (search_engine !== "google") {
                goto_url = "https://www.google.com/search?q=" + query;
                url_data = "went_to=google&q=" + query;
                Backbone.history.navigate(url_data);
                window.location = goto_url;
            }
        }
    });

    App.Router();
    Backbone.history.start();
});
