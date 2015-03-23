// Set up
var express             = require('express');
var app                 = express();
var swig                = require('swig');
var http                = require('http');
var morgan              = require('morgan');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');

// Configuration
app.use(express["static"](__dirname + '/public'));
app.use(morgan('dev')); // Log every request to the console  <---- Change in production
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(methodOverride());

// Swig
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.set('view engine', 'html');

app.get("/", function(req, res) {
	res.render('index');
});

http.createServer(app).listen(8000, function () {
    console.log('Server listening on port ', 8000);
});
