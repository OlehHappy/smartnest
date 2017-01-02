/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Country = mongoose.model('Country');


exports.country = function(req, res, next, id) {
  var objId;
  if (mongoose.Types.ObjectId.isValid(id)) {
     objId = new mongoose.Types.ObjectId(id);
  }

  Country.findOne({$or: [{_id: objId}, {alpha3: id.toUpperCase()}]}).lean().exec().then( function(country) {
    if (!country) {
      return next(new Error('Failed to load country ' + id));
    }

    req.country = country;
    next();
  });
};


exports.list = function(req, res, next) {
  Country.find({}).lean().exec().then( function(countries) {
    return res.jsonp(countries);
  });
};


exports.get = function(req, res, next) {
  return res.jsonp(req.country);
};


exports.getStates = function(req, res, next) {
  return res.jsonp(req.country.states);
};
