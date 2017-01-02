var Q = require('q'),
  _ = require('underscore'),
  request = require('request');

/**
 * get Card info from https://www.binlist.net/
 */
exports.getCardInfo = function(bin) {
  // check Bin format, should be 6 digits
  if (String(bin).length != 6) {
    throw new Error('Invalid BIN');
  }

  var httpOpts = {
    url: 'https://www.binlist.net/json/' + bin,
    json: true
  };

  return Q.ninvoke(request, 'get', httpOpts).then( function(res) {
    return res[1];

  }).fail( function(err) {
    console.error('BinList error:', err);
    throw new Error(err);
  });
};