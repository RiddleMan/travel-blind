'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var maps = require('../../components/mapsConnector')(config.maps);

// Get connection from point A to B
exports.index = function(req, res) {
  maps.directions.get(req.query)
    .then(function(response) {
      return res.json(200, response);

    })
};

function handleError(res, err) {
  return res.send(500, err);
}
