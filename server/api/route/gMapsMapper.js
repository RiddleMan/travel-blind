var xml2js = require('xml2js');
var _ = require('lodash');

// Get connection from point A to B
function mapSteps(steps) {
  return steps.filter((step) => step.travel_mode[0] === 'TRANSIT')
      .map((step) => {
        var tmp = step.transit_details[0];
        return {
          from: tmp.departure_stop[0].name[0],
          to: tmp.arrival_stop[0].name[0],
          stopsCount: tmp.num_stops[0],
          departure: tmp.departure_time[0].text[0],
          arrival: tmp.arrival_time[0].text[0],
          duration: step.duration[0].text,
          line: (tmp.line[0].short_name || tmp.line[0].name)[0]
        };
    });
}

function mapToJson(directionsRes) {
  var tmp = directionsRes.DirectionsResponse.route[0].leg[0];
  var res = {};

  res.departure = tmp.departure_time[0].text;
  res.duration = tmp.duration[0].text;
  res.arrival = tmp.arrival_time[0].text;
  res.distance = tmp.distance[0].text;
  res.steps = mapSteps(tmp.step);

  return res;
}

function beginDetails(details) {
  return [`Journey will take ${details.duration}`,
    `You must starts at ${details.departure}`,
    `Distance of whole trip is ${details.distance}`,
    `You will be at destination at ${details.arrival}`];
}

function speechStopMapper(stop, introductionWord) {
  return [
    `${introductionWord} you must go to ${stop.from} and take ${stop.line}.`,
    `Transit runs at ${stop.departure}`,
    `You must get out ${stop.stopsCount} stops later in ${stop.to}`,
    `It takes approximetaly ${stop.duration} and wil be at ${stop.arrival}`
  ];
}

function determineIntroductionWord(idx, length) {
  if(idx === 0)
    return 'Firstly';

  if(idx === length - 1)
    return 'Lastly';

  return 'Next';
}

function stopsDetails(stops) {
  return stops.map((el, idx) => {
    return speechStopMapper(el, determineIntroductionWord(idx, stops.length));
  }).reduce((prev, next) => {
    return prev.concat(next);
  }, []);
}

function endDetails() {
  return ['Thank you for your attention!'];
}

function toSpeech(details) {
  return {
    step: beginDetails(details).concat(stopsDetails(details.steps), endDetails())
  };
}

function buildXml(json) {
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
}


module.exports = function(xml) {
  var resp = mapToJson(xml);
  return buildXml({
    steps: toSpeech(resp)
  });
};
