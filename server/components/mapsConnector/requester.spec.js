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

  describe('#get()', function() {
    var getSpy;

    afterEach(function() {
      if(getSpy)
        getSpy.restore();
    });

    it('should be defined', function() {
      instance.get.should.be.ok;
    });

    it('should throw an error when no url was specified', function() {
      (function() {
        instance.get();
      }).should.throw('No url was specified');
    });

    it('should respond without error', function(done) {
      getSpy = sinon.stub(request, 'get', function(url, cb) {
        cb(undefined, {
          statusCode: 200
        });
      });

      instance.get('/url')
        .then(function(response) {
          response.should.be.ok;
          done();
        });
    });

    it('should respond with error when statusCode !== 200', function(done) {
      getSpy = sinon.stub(request, 'get', function(url, cb) {
        cb('asdfasdf', {
          statusCode: 300
        });
      });

      instance.get('/test')
        .then(function(){}, function(err) {
          err.should.be.ok;
          done();
        });
    });

    it('should request api in given url', function(done) {
      var urlSuffix = '/test';

      getSpy = sinon.stub(request, 'get', function(url, cb) {
          url.should.be.equal('http://maps.googleapis.com/maps/api' +
            urlSuffix + '?key=' + config.maps.apiKey);
          done();
      });

      instance.get(urlSuffix);
    });

    it('should add optional parameter to url', function(done) {
      var options = {
        test: 'a'
      };
      var apiUrl = 'test';

      getSpy = sinon.stub(request, 'get', function(rqUrl, cb) {
        var expectUrl = url.parse(url.resolve('http://maps.googleapis.com/maps/api/', apiUrl));
        expectUrl.query = _.extend(options, {
          key: config.maps.apiKey
        });

        rqUrl.should.be.equal(url.format(expectUrl));
        done();
      });

      instance.get(apiUrl, options);
    });

    it('should pass parameters in snake case', function(done) {
      var options = {
        test: 'a',
        'snake_case': 'blabla'
      };
      var apiUrl = 'test';

      getSpy = sinon.stub(request, 'get', function(rqUrl, cb) {
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
