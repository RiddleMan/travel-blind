'use strict';

var _ = require('lodash');

// Get connection from point A to B
exports.connection = function(req, res) {
    return res.json(200, {});
};

function handleError(res, err) {
  return res.send(500, err);
}
