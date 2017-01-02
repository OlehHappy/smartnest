
var fs = require('fs'),
    mongoose = require('mongoose'),
    merge = require('mongoose-merge-plugin');


module.exports = function(config, models_path) {

  //Mongoose Plugins
  mongoose.plugin(merge);

  //Bootstrap db connection
  var db = mongoose.connect(config);

  //Bootstrap models
  if (models_path) {
    var walk = function(path) {
      fs.readdirSync(path).forEach( function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
          if (/(.*)\.(js|coffee)$/.test(file)) {
            require(newPath);
          }
        } else if (stat.isDirectory()) {
          walk(newPath);
        }
      });
    };
    walk(models_path);
  }

  return db;
};
