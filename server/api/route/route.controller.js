'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var maps = require('../../components/mapsConnector')(config.maps);
var xmlActions = require('../../components/xml');
var xmlParse = require('xml2js').parseString;

function xml(res, payload, status) {
  if(status)
    res.status(status);

  res.set('Content-Type', 'application/xml');
  res.send(payload);
}

function gMapsCheck(res, body) {
  mapBody(body)
    .then((params) => {
      return maps.directions.get({
          origin: params.origin,
          destination: params.destination,
          mode: 'transit',
          units: 'metric'
      });
    })
    .then((response) => xmlActions.transform(response), (err) => fiveHundred(res))
    .then((response) => xml(res, response.stdout, 200), (err) => fiveHundred(res));
}

function fiveHundred(res) {
  xml(res, `
    <xml>
      <error>Unexpected server error</error>
    </xml>`, 500);
}

function mapBody(body) {
  return new Promise((resolve, reject) => {
    xmlParse(body, function(err, res) {
      if(err)
        return reject(err);

      resolve({
        origin: res.request.origin[0],
        destination: res.request.destination[0]
      });
    });
  });
}

module.exports.index = function(req, res, body) {
  xmlActions.validate(req.body)
    .then((result) => {
      if(result) {
        console.log('asdf');
        return gMapsCheck(res, req.body);
      } else {
        xml(res, `<xml>
          <response>
            <error>Bad request</error>
          </response>`, 400);
      }
    })
    .catch((err) => fiveHundred(res));
};
