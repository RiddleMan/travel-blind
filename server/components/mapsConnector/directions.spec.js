var directions = require('./directions');
var requester = require('./requester');
var should = require('should');
var sinon = require('sinon');
var _ = require('lodash');

var config = require('../../config/environment/test');

describe('Directions', () => {
  describe('#constructor()', () => {
    it('should be defined and function', () => {
      directions.should.be.ok;
      (typeof directions).should.equal('function');
    });

    it('should throw an error when no requester was passed', () => {
      (() => {
        directions();
      }).should.throw('No requester was specified');
    });

    it('should create an instance', () => {
      var instance = directions({});
      instance.should.be.ok;
      (typeof instance).should.equal('object');
    })
  });

  describe('#get()', () => {
    var instance;
    var requesterMock = {};

    before(() => {
      instance = directions(requesterMock);
    });

    it('should be defined', () => {
      instance.get.should.be.ok;
    });

    it('should be function', () => {
      (typeof instance.get).should.equal('function');
    });

    it('should throw error when no parameters was specified', () => {
      (() => {
        instance.get();
      }).should.throw('No parameters was passed');
    });

    it('should throw error when passed argument was not an object', () => {
      (function () {
        instance.get('asdf');
      }).should.throw('Paremeter must be a object');
    });

    it('should throw error when origin was not specified', () => {
      (() => {
        instance.get({});
      }).should.throw('Origin option is required');
    });

    it('should throw error when destination was not specified', () => {
      (() => {
        instance.get({
          origin: 'asdf',
        });
      }).should.throw('destination option is required');
    });

    it('should query requester to directions apiUrl with options', (done) => {
      var _apiUrl = '/directions/xml';
      var _options = {
        origin: 'asdf',
        destination: 'asdf'
      };

      requesterMock.get = (url, options) => {
        url.should.equal(_apiUrl);
        options.should.equal(_options);
        done();
      };

      instance.get(_options);
    })
  });

  describe('#connection()', () => {
    var instance;
    var requesterMock = {};

    beforeEach(() => {
      instance = directions(requesterMock);
    });

    it('should be defined', () => {
      instance.connection.should.be.ok;
    });

    it('should be a function', () => {
      (typeof instance.connection).should.equal('function');
    });

    it('should throw error when origin was not specified', () => {
      (() => {
        instance.connection();
      }).should.throw('Origin option is required');
    })

    it('should throw error when destination was not specified', () => {
      (() => {
        instance.connection('asdf');
      }).should.throw('destination option is required');
    });

    it('should query requester to directions apiUrl with options', (done) => {
      var _apiUrl = '/directions/json';
      var _options = {
        origin: 'asdf',
        destination: 'asdf'
      };

      requesterMock.get = (url, options) => {
        url.should.equal(_apiUrl);
        _.isEqual(options, _options).should.be.ok;
        done();
      };

      instance.connection(_options.origin, _options.destination);
    });
  });
});
