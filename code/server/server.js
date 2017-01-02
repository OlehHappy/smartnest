/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

/**
  * Module dependencies.
 */
var express = require('express'),
    passport = require('passport');

//Load configurations
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./config/config');

console.log("Environment: ", env);

//bootstrap mongodb
var db = require('./config/database')(config.db, __dirname + '/models');

//bootstrap passport config
require('./config/passport')(passport);

var app = express();

//express settings
require('./config/express')(app, passport, db);

//Bootstrap routes
require('./config/routes')(app, passport);

//setup cron
require('./config/cron')();

//Start the app by listening on <port>
var port = process.env.PORT || config.port;

app.listen(port);
console.log('Express app started on port ' + port);

//expose app
exports = module.exports = app;
