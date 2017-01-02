/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  alpha3: {
    type: String,
    required: true
  },
  states: [
    {
      name: {
        type: String,
        required: true
      },
      alpha2: {
        type: String,
        required: true
      }
    }
  ]
});

/**
 * Validations
 */
CountrySchema.path('name').validate(function(name) {
  return (name && name.length);
}, 'Name cannot be blank');

CountrySchema.path('alpha3').validate(function(alpha3) {
  return (alpha3 && alpha3.length);
}, 'Alpha3 cannot be blank');


mongoose.model('Country', CountrySchema);
