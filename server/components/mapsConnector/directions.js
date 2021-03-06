var _ = require('lodash');

var DIRECTIONS_URL = '/directions/xml';

module.exports = function Directions(requester) {
  if(!requester)
    throw new Error('No requester was specified');

  function _get(options) {
    if(!options)
      throw new Error('No parameters was passed');

    if(!_.isObject(options))
      throw new Error('Paremeter must be a object');

    if(!options.origin)
      throw new Error('Origin option is required');

    if(!options.destination)
      throw new Error('destination option is required');

    return requester.get(DIRECTIONS_URL, options);
  }

  function _connection(origin, destination) {
    return _get({
      origin: origin,
      destination: destination,
      mode: 'transit'
    });
  }

  return {
    get: _get,
    connection: _connection
  };
};
