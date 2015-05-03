var MapsConnector = require('./index');
var should = require('should');
var requester = require('./requester');
var _ = require('lodash');
var sinon = require('sinon');

describe('MapsConnector', function() {
  it('should be defined', function () {
    MapsConnector.should.be.ok;
  });

  it('should be a object', function () {
    (typeof MapsConnector).should.equal('function');
  });

  describe('#constructor()', function() {
    it('should create a instance', function() {
      MapsConnector({
        apiKey: 'key'
      }).should.be.ok;
    });

    it('should create a instance of requester with specified paremeters', function() {
      var _options = {
        apiKey: 'asdf',
        secure: true
      };

      MapsConnector(_options);

      sinon.spy(requester).withArgs(_options).calledOnce
        .should.be.ok;
    });
  });

  describe('.directions', function() {
    var instance;

    beforeEach(function() {
      instance = MapsConnector({
        apiKey: 'asdf'
      });
    })

    it('should be defined', function() {
      instance.directions.should.be.ok;
    });

    it('should have get property', function() {
      instance.directions.get.should.be.ok;
    });

    it('should have connection property', function() {
      instance.directions.connection.should.be.ok;
    });
  });
});
