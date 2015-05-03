var directions = require('./directions');
var requester = require('./requester');
var should = require('should');
var sinon = require('sinon');
var _ = require('lodash');

var config = require('../../config/environment/test');

describe('Directions', function() {
  describe('#constructor()', function() {
    it('should be defined and function', function() {
      directions.should.be.ok;
      (typeof directions).should.equal('function');
    });

    it('should throw an error when no requester was passed', function() {
      (function() {
        directions();
      }).should.throw('No requester was specified');
    });

    it('should create an instance', function() {
      var instance = directions({});
      instance.should.be.ok;
      (typeof instance).should.equal('object');
    })
  });

  describe('#get()', function() {
    var instance;
    var requesterMock = {};

    before(function() {
      instance = directions(requesterMock);
    });

    it('should be defined', function() {
      instance.get.should.be.ok;
    });

    it('should be function', function() {
      (typeof instance.get).should.equal('function');
    });

    it('should throw error when no parameters was specified', function() {
      (function() {
        instance.get();
      }).should.throw('No parameters was passed');
    });

    it('should throw error when passed argument was not an object', function() {
      (function () {
        instance.get('asdf');
      }).should.throw('Paremeter must be a object');
    });

    it('should throw error when origin was not specified', function() {
      (function() {
        instance.get({});
      }).should.throw('Origin option is required');
    });

    it('should throw error when destination was not specified', function() {
      (function() {
        instance.get({
          origin: 'asdf',
        });
      }).should.throw('destination option is required');
    });

    it('should query requester to directions apiUrl with options', function(done) {
      var _apiUrl = '/directions/json';
      var _options = {
        origin: 'asdf',
        destination: 'asdf'
      };

      requesterMock.get = function(url, options) {
        url.should.equal(_apiUrl);
        options.should.equal(_options);
        done();
      };

      instance.get(_options);
    })
  });

  describe('#connection()', function() {
    var instance;
    var requesterMock = {};

    beforeEach(function() {
      instance = directions(requesterMock);
    });

    it('should be defined', function() {
      instance.connection.should.be.ok;
    });

    it('should be a function', function() {
      (typeof instance.connection).should.equal('function');
    });

    it('should throw error when origin was not specified', function() {
      (function() {
        instance.connection();
      }).should.throw('Origin option is required');
    })

    it('should throw error when destination was not specified', function() {
      (function() {
        instance.connection('asdf');
      }).should.throw('destination option is required');
    });

    it('should query requester to directions apiUrl with options', function(done) {
      var _apiUrl = '/directions/json';
      var _options = {
        origin: 'asdf',
        destination: 'asdf'
      };

      requesterMock.get = function(url, options) {
        url.should.equal(_apiUrl);
        _.isEqual(options, _options).should.be.ok;
        done();
      };

      instance.connection(_options.origin, _options.destination);
    });
  });
});
