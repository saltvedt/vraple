window.onunload = function () {};

$(function () {
    "use strict";

    window.App = {
        Router: {},
        View: {}
    };

    App.Vraple = {
        vraple: function(query) {
             //parse the query and determine what search engine to send the user

            //matches queries which have !bangs in them
            var duckduckgo = /!\w{1,}/;

            // if it looks like math, it probably is math
            var wolfram_alpha = /(^\(\d)|(^\d.*\d$)|(\d\)$)/;

            // if it ends with !, it should go to first google result
            var gifl = /.*!$/;

            // if it start with \, it uses ddg's syntax for going to the first search result
            var difl = /^\\.*/;

            var goto_url;
            var url_data;
            if (wolfram_alpha.test(query)) {
                goto_url = "https://www.wolframalpha.com/input/?i=" + query;
                url_data = "went_to=wolfram_alpha&q=" + query;
            } else if (duckduckgo.test(query) || difl.test(query)) {
                goto_url = "http://duckduckgo.com/?q=" + query;
                url_data = "went_to=duckduckgo&q=" + query;
            } else if (gifl.test(query)) {
                goto_url = "https://www.google.com/search?btnI&q=" + query;
                url_data = "went_to=gifl&q=" + query;
            } else {
                goto_url = "https://www.google.com/search?q=" + query;
                url_data = "went_to=google&q=" + query;
            }

            //add the params of which search engine we"re going to send the user to the history of the browser,
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
    };

    App.View.Index = Backbone.View.extend({
        tagName: "div",

        events: {
            "submit #search-button": "vraple",
            "click #search-button": "vraple"
        },

        initialize: function() {
            this.render();
        },

        render: function() {
            $(".faq").show();
            $("#search-box").focus();
        },

        vraple: function(event) {
            event.preventDefault();
            App.Vraple.vraple($("#search-box").val());
        }
    });

    App.Router = Backbone.Router.extend({
        routes: {
            "":                                 "index",
            "q=:query":                         "vraple",
            "went_to=:search_engine&q=:query" : "search"
        },

        index: function () {
            new App.View.Index({el: $("#vraple-search")});
        },

        vraple: function (query) {
            $("#search-box").val(query);
            App.Vraple.vraple(query);
        },

        search: function (search_engine, query) {
            App.Vraple.search(search_engine, query);
        }
    });

    new App.Router();

    Backbone.history.start();
});
