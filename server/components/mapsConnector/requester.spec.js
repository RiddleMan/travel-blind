var requester = require('./requester');
var config = require('../../config/environment/test');
var should = require('should');

describe('Requester', function() {
  var instance;
  before(function() {
    instance = requester({
      secure: false,
      apiKey: config.maps.apiKey
    });
  });

  it('should be defined', function() {
    instance.should.be.ok;
  });

  it('should throw an error when no options was specified', function() {
    (function() {
      requester();
    }).should.throw('No options was specified');
  });

  it('should throw an error if no apiKey was specified', function() {
    (function() {
      requester({});
    }).should.throw('No apiKey was specified');
  });

  describe('get', function() {
    it('should be defined', function() {
      instance.get.should.be.ok;
    });

    it('should throw an error when no url was specified', function() {
      (function() {
        instance.get();
      }).should.throw('No url was specified');
    });

    it('should respond without error', function(done) {
      instance.get('/directions/json?origin=Toledo&destination=Madrid')
        .then(function(response) {
          response.should.be.ok;
          done();
        })
        .catch(done);
    });
  });

})
