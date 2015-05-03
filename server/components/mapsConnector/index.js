var directions = require('./directions');
var requester = require('./requester');

module.exports = function MapConnector(config) {
  var requesterInstance = requester(config);

  return {
    directions: directions(requesterInstance)
  }
};
