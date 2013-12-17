
var express = require('express'),
    exphbs  = require('express3-handlebars')
//    cons    = require('consolidate'),
    path    = require('path')
    ;

// Routes
var route_toplevel = require('./routes/index'),
    route_data     = require('./routes/data'),
    route_images   = require('./routes/images'),
    route_api      = require('./routes/api')
    route_auth     = require('./routes/auth/index')
    route_auth_api = require('./routes/auth/api')
    ;

var app = express();

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
  process.exit(1);
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'handlebars');
    app.set('responsive_images', __dirname + '/respimg');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use('/s', express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('view options', { debug: true, pretty: true });
  app.use(express.logger('dev'));
});

//app.use(express.static(__dirname + '/public'));

app.get('/', route_toplevel.index);

app.get(/^\/i\/thumb\/(.*)$/, route_images.thumb);

app.get('/data/fuel_consumption',  route_data.fuel_consumption);
app.get('/data/electricity_usage', route_data.electricity_usage);

app.get(/^\/api\/fuel_data\/(\d+)$/, route_api.fuel_data);
app.get('/api/power', route_api.power);

// Authenticated paths
//
//app.get('/auth/add_fuel_data',      route_auth.add_fuel_data);
//app.get('/auth/api/add_fuel_data',  route_auth_api.add_fuel_data);


/* Provide a markdown parser that can use variables */
//app.helpers({
//    markdown: function(txt) {
//        return markdown.toHTML(txt);
//    }
//});

app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));
