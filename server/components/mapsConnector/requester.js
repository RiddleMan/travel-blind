var Q = require('q');
var request = require('request');
var _ = require('lodash');

function buildUrl(secure) {
  var protocol = secure ? 'https' : 'http';

  return protocol + '://maps.googleapis.com/maps/api';
}

module.exports = function Requester(options) {
  var _baseUrl,
      _options;

  if(!options)
    throw new Error('No options was specified');

  if(!options.apiKey)
    throw new Error('No apiKey was specified');

  _options = _.extend({
    secure: true,
  }, options);

  _baseUrl = buildUrl(_options.secure);

  function _get(url) {
    var deferred = Q.defer();
    if(!url)
      throw new Error('No url was specified');

    request
      .get(_authenticateUrl(_baseUrl + url),
        function(err, response, body) {
          if(err || response.statusCode !== 200)
            deferred.reject(err || response);

          deferred.resolve(response);
      });

    return deferred.promise;
  }

  function _authenticateUrl(url) {
    return url.indexOf('?') !== -1 ?
      url + '&key=' + _options.apiKey
      : url + '?key=' + _options.apiKey;
  }

  return {
    get: _get
  };
};
