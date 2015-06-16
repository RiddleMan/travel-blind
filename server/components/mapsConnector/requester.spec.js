var requester = require('./requester');
var should = require('should');
var sinon = require('sinon');
var request = require('request');
var url = require('url');
var _ = require('lodash');

var config = {
  maps: {
    apiKey: 'test'
  }
};

describe('Requester', () =>  {
  var instance;
  before(() =>  {
    instance = requester({
      secure: false,
      apiKey: config.maps.apiKey
    });
  });

  it('should be defined', () =>  {
    //jshint -W030
    instance.should.be.ok;
  });

  it('should throw an error when no options was specified', () =>  {
    (() =>  {
      requester();
    }).should.throw('No options was specified');
  });

  it('should throw an error if no apiKey was specified', () =>  {
    (() =>  {
      requester({});
    }).should.throw('No apiKey was specified');
  });

  describe('#get()', () =>  {
    var getSpy;

    afterEach(() =>  {
      if(getSpy)
        getSpy.restore();
    });

    it('should be defined', () =>  {
      //jshint -W030
      instance.get.should.be.ok;
    });

    it('should throw an error when no url was specified', () =>  {
      (() =>  {
        instance.get();
      }).should.throw('No url was specified');
    });

    it('should respond without error', (done) => {
      getSpy = sinon.stub(request, 'get', (url, cb) => {
        cb(undefined, {
          statusCode: 200,
          body: JSON.stringify({

          })
        });
      });

      instance.get('/url')
        .then(function(response) {
          //jshint -W030
          response.should.be.ok;
          done();
        });
    });

    it('should respond with error when statusCode !== 200', (done) => {
      getSpy = sinon.stub(request, 'get', (url, cb) => {
        cb(undefined, {
          statusCode: 300
        });
      });

      instance.get('/test')
        .then(() => {}, (err) => {
          //jshint -W030
          err.should.be.ok;
          done();
        });
    });

    it('should request api in given url', (done) => {
      var urlSuffix = '/test';

      getSpy = sinon.stub(request, 'get', (url, cb) => {
          url.should.be.equal('http://maps.googleapis.com/maps/api' +
            urlSuffix + '?key=' + config.maps.apiKey);
          done();
      });

      instance.get(urlSuffix);
    });

    it('should add optional parameter to url', (done) => {
      var options = {
        test: 'a'
      };
      var apiUrl = 'test';

      getSpy = sinon.stub(request, 'get', (rqUrl, cb) => {
        var expectUrl = url.parse(url.resolve('http://maps.googleapis.com/maps/api/', apiUrl));
        expectUrl.query = _.extend(options, {
          key: config.maps.apiKey
        });

        rqUrl.should.be.equal(url.format(expectUrl));
        done();
      });

      instance.get(apiUrl, options);
    });

    it('should pass parameters in snake case', (done) => {
      var options = {
        test: 'a',
        'snake_case': 'blabla'
      };
      var apiUrl = 'test';

      getSpy = sinon.stub(request, 'get', (rqUrl, cb) => {
        var expectUrl = url.parse(url.resolve('http://maps.googleapis.com/maps/api/', apiUrl));
        expectUrl.query = _.extend(options, {
          key: config.maps.apiKey
        });

        rqUrl.should.be.equal(url.format(expectUrl));
        done();
      });

      instance.get(apiUrl, options);
    });
  });

})
