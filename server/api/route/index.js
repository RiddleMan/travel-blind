'use strict';

var express = require('express');
var controller = require('./route.controller');

var router = express.Router();

router.get('/connection', controller.connection);

module.exports = router;
