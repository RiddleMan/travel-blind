var requester = require('./requester');
var MapsConnector = require('./index');
var should = require('should');
var _ = require('lodash');
var sinon = require('sinon');

describe('MapsConnector', () => {
  it('should be defined', () => {
    //jshint -W030
    MapsConnector.should.be.ok;
  });

  it('should be a object', () => {
    (typeof MapsConnector).should.equal('function');
  });

  describe('#constructor()', () => {
    it('should create a instance', () => {
      //jshint -W064
      //jshint -W030
      MapsConnector({
        apiKey: 'key'
      }).should.be.ok;
    });


    //Hard stuff
    // it('should create a instance of requester with specified paremeters', () => {
    //   var _options = {
    //     apiKey: 'asdf',
    //     secure: true
    //   };
    //
    //   var spy = sinon.spy(requester);
    //
    //   MapsConnector(_options);
    //
    //
    //   spy.calledWith(_options).should.be.ok;
    //   spy.calledOnce.should.be.ok;
    // });
  });

  describe('.directions', () => {
    var instance;

    beforeEach(() => {
      //jshint -W064
      instance = MapsConnector({
        apiKey: 'asdf'
      });
    })

    it('should be defined', () => {
      //jshint -W030
      instance.directions.should.be.ok;
    });

    it('should have get property', () => {
      //jshint -W030
      instance.directions.get.should.be.ok;
    });

    it('should have connection property', () => {
      //jshint -W030
      instance.directions.connection.should.be.ok;
    });
  });
});
