var directions = require('./directions');
var requester = require('./requester');

var config = require('../../config/environment/test');

describe('Directions', function() {
  var instance;
  var requesterMock = {

  }

  before(function() {
    instance = directions(
      requester({
        secure: false,
        apiKey: config.maps.apiKey
      })
    );
  });


  describe('#constructor', function() {
    it('should be defined', function() {
      directions.should.be.ok;
    });

    it('should throw an error when no requester was passed', function() {
      (function() {
        directions();
      }).should.throw('No requester was specified');
    });

    it('should create an instance', function() {
      instance.should.be.ok;
    })
  });

  describe('#get', function() {
    it('should')
  });

  describe('#connection', function() {
    it('should be defined', function() {

    });
  });
});
