// express stack
const express = require('express')
  , path = require('path')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , app = express()
  , server = require('http').createServer(app);

// load ENV vars from .env file
require("dotenv").config();

// Dirs are stored in global vars
global.rootDir = path.resolve(__dirname) + '/';
global.middlewaresDir = path.join(rootDir, 'middlewares/');
global.routesDir = path.join(rootDir, 'routes/');
global.servicesDir = path.join(rootDir, 'services/');

// Websockets
const io = require('socket.io')(server); // Initialize io here and pass it wherever needed.
const authorizeWithJwt = require(middlewaresDir + "/sockets/authorize");
io.use(authorizeWithJwt);

// Template engine
app.set('views', path.join(rootDir, 'views'));
app.set('view engine', 'pug');

// Session
app.use(require(middlewaresDir + "/session"));

// Flash messages
app.use(require('express-flash-messages')());

// Basic express stack
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, 'public')));

// Routes
// root path
app.get('/', (req, res) => res.redirect('/sign_in'));
app.use('/', require(routesDir + 'index'));
app.use('/comments', require(routesDir + 'comments')(io));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app: app,
  server: server
};
