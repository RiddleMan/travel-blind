var Q = require('q');
var request = require('request');
var _ = require('lodash');
var url = require('url');
var changeCase = require('change-case');
var parseString = require('xml2js').parseString;

function buildBaseUrl(secure, key) {
  return {
    host: 'maps.googleapis.com',
    pathname: '/maps/api/',
    protocol: secure ? 'https' : 'http',
    query: {
      key: key
    }
  };
}

function prepareUrl(rqUrl, apiUrl, options) {
  var _options = _.reduce(_.keys(options), function(result, key) {
    result[changeCase.snakeCase(key)] = options[key];
    return result;
  }, {});

  rqUrl.query = _.extend(_options, rqUrl.query);
  rqUrl.pathname = url.resolve(rqUrl.pathname, apiUrl.indexOf('/') === 0 ? apiUrl.substr(1) : apiUrl);

  return url.format(rqUrl);
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

  _baseUrl = buildBaseUrl(_options.secure, _options.apiKey);

  function _get(rqUrl, options) {
    var deferred = Q.defer();
    if(!rqUrl)
      throw new Error('No url was specified');

    var resultUrl = prepareUrl(_.cloneDeep(_baseUrl), rqUrl, options);

    request
      .get(resultUrl,
        function(err, response, body) {
          if(err || response.statusCode !== 200)
            return deferred.reject(err || response);

          parseString(response.body, function (err, result) {
            if(err || result.DirectionsResponse.error_message)
              return deferred.reject(err || result.DirectionsResponse.error_message[0]);

            deferred.resolve(response.body);
          });
      });

    return deferred.promise;
  }

  return {
    get: _get
  };
};
