/**
 * Module dependencies.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config'),
    pjson = require('../package.json'),
    errors = require('./errors');

module.exports = function(app, passport, db) {
  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  app.use( function(req, res, next) {
    if (req.header('x-forwarded-proto') && req.header('x-forwarded-proto') !== config.app.protocol) {
      return res.redirect(301, config.app.protocol + '://' + (req.header('host') || config.app.host_name) + req.originalUrl);
    }
    next();
  });

  // Should be placed before express.static
  app.use( express.compress({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // insert App version number into response header
  app.use( function(req, res, next) {
    if (pjson.version) {
      res.setHeader("app-version", pjson.version);
    }
    next();
  });

  // CORS
  app.use( function(req, res, next) {
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-dashboard-api-token');

      res.send(200);
    } else {
      next();
    }
  });

  // Setting the fav icon and static folder
  app.use(express.favicon());
  app.use(express.static(config.root + '/client'));

  // Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  // Set views path, template engine and default layout
  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');

  // Enable jsonp
  app.enable("jsonp callback");

  var bodyParser = function(options) {
    var _urlencoded = express.urlencoded(options),
        _multipart = express.multipart(options),
        _json = express.json(options);

    return function(req, res, next) {
      var buf = '';
//      req.setEncoding('utf8');
      req.on('data', function(chunk) { buf += chunk; });
      req.on('end', function() {
        req.rawBody = buf;
      });

      return _json(req, res, function(err) {
        if (err) return next(err);
        return _urlencoded(req, res, function(err) {
          if (err) return next(err);
          return _multipart(req, res, next);
        });
      });
    };
  };


  app.configure( function() {
    // cookieParser should be above session
    app.use(express.cookieParser());

    // body parsing middleware should be above methodOverride
    app.use(bodyParser());
    app.use(express.methodOverride());

    // express/mongo session storage
    app.use(express.session({
      secret: 'MEAN',
      cookie: {
        maxAge: 86400000, // 24 hours
        domain: ""
      },
      store: new mongoStore({
        db: db.connection.db,
        collection: 'sessions'
      })
    }));

    // connect flash for flash messages
    app.use(flash());

    // dynamic helpers
    app.use(helpers(config.app.name));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // routes should be at the last
    app.use(app.router);


    //TODO refactor, duplicated code
    // Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use( function(err, req, res, next) {
      var message = (err instanceof Error) ? err.message : err;

      // Treat as 404
      if (typeof message === 'string' && ~message.indexOf('not found')) {
        return next();
      }

      var statusCode = 500;
      if (err instanceof errors.HttpError) {
        statusCode = err.statusCode;
      }

      if (err instanceof errors.AuthError) {
        res.setHeader('X-Auth-Type', err.authType);
      }

      // Log it
      console.error(err.stack ? err.stack : message);

      if (req.accepted.length && req.accepted[0].value.indexOf('html') !== -1) {
        res.status(statusCode).render('error', {
          error: err.stack,
          base_url: config.app.base_url
        });
      } else if (req.accepts('plain')) {
        res.send(statusCode, message);
      } else if (req.accepts('json')) {
        res.jsonp(statusCode, {message: message});
      } else {
        res.status(statusCode).render('error', {
          error: err.stack,
          base_url: config.app.base_url
        });
      }
    });
    //---

    // Assume 404 since no middleware responded
    app.use( function(req, res, next) {
      if (req.accepted.length && req.accepted[0].value.indexOf('html') !== -1) {
        res.status(404).render('404', {
          url: req.originalUrl,
          error: 'Not found',
          base_url: config.app.base_url
        });
      } else if (req.accepts('plain')) {
        res.send(404, 'Not found');
      } else if (req.accepts('json')) {
        res.jsonp(404, {message: 'Not found'});
      } else {
        res.status(404).render('404', {
          url: req.originalUrl,
          error: 'Not found',
          base_url: config.app.base_url
        });
      }
    });
  });
};
