'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var maps = require('../../components/mapsConnector')(config.maps);
var xml2js = require('xml2js');

// Get connection from point A to B
function buildResponse(directionsRes) {
  var tmp = directionsRes.DirectionsResponse.route[0].leg[0];
  var res = {};

  res.departure = tmp.departure_time[0].text;
  res.arrival = tmp.arrival_time[0].text;
  res.distance = tmp.distance[0].text;
  res.steps = {
    step: tmp.step.filter((step) => step.travel_mode[0] === 'TRANSIT')
      .map((step) => {
        var tmp = step.transit_details[0];
        return {
          from: tmp.departure_stop[0].name[0],
          to: tmp.arrival_stop[0].name[0],
          stopsCount: tmp.num_stops[0],
          departure: tmp.departure_time[0].text[0],
          arrival: tmp.arrival_time[0].text[0],
          line: (tmp.line[0].short_name || tmp.line[0].name)[0]
        };
    })
  }

  return res;
}

function buildXml(json) {

  var builder = new xml2js.Builder();
  return builder.buildObject(json);
}

module.exports.index = function(req, res) {
  maps.directions.get({
      origin: req.query.origin,
      destination: req.query.destination,
      mode: 'transit',
      units: 'metric'
    })
    .then((response) => {
      res.set('Content-Type', 'application/xml');
      var resp = buildResponse(response);
      var xml = buildXml(resp);
      res.send(xml);

    }, (err) => res.json(403, err))
    .catch((err) =>
      console.dir(err));
};

function handleError(res, err) {
  return res.send(500, err);
}
