'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var maps = require('../../components/mapsConnector')(config.maps);
var mapper = require('./gMapsMapper');

function xml(res, payload, status) {
  if(status)
    res.status(status);

  res.set('Content-Type', 'application/xml');
  res.send(payload);
}

module.exports.index = function(req, res) {
  if(!req.query.origin)
    xml(res, `
      <xml>
        <error>Origin parameter is required</error>
      </xml>
      `, 400);

  if(!req.query.destination)
    xml(res, `
      <xml>
        <error>Destination parameter is required</error>
      </xml>
      `, 400);

  maps.directions.get({
      origin: req.query.origin,
      destination: req.query.destination,
      mode: 'transit',
      units: 'metric'
    })
    .then((response) => {
      xml(res, mapper(response));

    }, (err) => xml(res, `<xml>
        <error>${err}</error>
      </xml>`, 403))
    .catch((err) => xml(res, `
      <xml>
        <error>Unexpected server error</error>
      </xml>`, 500));
};
