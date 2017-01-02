var _ = require('lodash');

// release version
var pjson = require('../package.json');
    version = pjson.version;

// Load app configuration
module.exports = _.merge(
  require(__dirname + '/../config/env/all.js'),
  require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
);
