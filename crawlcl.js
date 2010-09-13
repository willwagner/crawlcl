// crawlcl.js by Will Wagner.  Downloads and crawls a web page based on a Sizzle.js css selector.
//   Optionally executes a javascript function for each result.

var crawlcl = {
    DEBUG: false, // if set to true, writes out extra debugging info to console

    // Default function writes out the href
    _iterFunction: function(node, $){
        console.log(node.href);
    },

    // _log just writes out to console if debug is true
    _log: function(s){
        if(this.DEBUG){
            console.log(s);
        }
    },

    // String displayed if no parameters are passed
    helpString: function(){
        console.log("crawlcl url selector [jsfile]");
        console.log("   url = webpage to parse (e.g. http://www.google.com)");
        console.log("   selector = css selector to use for selecting nodes (e.g. \"#query\")");
        console.log("optional argument");
        console.log("   jsfile = the filename of the js file to load");
        console.log("");
        console.log("jsfile format");
        console.log("  This code will be executed on each item found.");
        console.log("  variables accessible from the is code:");
        console.log("    node - the dom element found");
        console.log("    $ - jquery");
    },

    // Loads the iterator function if it exists
    loadIterFunction: function(jsfile, callback){
        if(jsfile === undefined){
            callback();
        } else {
            var self = this;
            require('fs').readFile(jsfile, function(err, data){
                if(err) {
                    throw("js file not found");
                }
                self._iterFunction = new Function("node", "$", data);
                callback();
            });
        }
    },

    // loads the webpage
    loadWebPage: function(url, callback){
        require('request')( { uri: url}, function(err, resp, body){
            callback(body);
        });
    },

    // sets up web page and jquery, and then iterates over results
    loadData: function(sel, data){
        crawlcl._log("Sel: " + sel);
        crawlcl._log("Func: " + this._iterFunction);

        if(!data){
            throw("no data returned from request");
        }

        var jsdom = require("jsdom");
        var window = jsdom.createWindow(data);
        var func = this._iterFunction;
        jsdom.jQueryify(window, __dirname + "/jquery-1.4.2.min.js", function(){
            window.jQuery(sel).each(function() { func(this, window.jQuery);});
        });

    },

    // initializes our code and gets things started
    start: function(){
        var args = process.argv;
        crawlcl._log("arg length: " + args.length);
        if(args.length < 4){
            this.helpString();
        } else {
            var url = args[2];
            var sel = args[3];
            var jsfile;
            var self = this;
            if(args.length > 4){
                jsfile = args[4];
            }

            crawlcl._log("URL: " + url);
            crawlcl._log("sel: " + sel);
            crawlcl._log("jsfile: " + jsfile);

            this.loadIterFunction(
                jsfile, 
                function(){
                    self.loadWebPage(
                        url,
                        function(data){
                            self.loadData(sel, data);
                        }
                    );
                }
            );
        }
    }
};

crawlcl.start();
