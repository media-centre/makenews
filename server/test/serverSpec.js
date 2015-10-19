var request = require('supertest');
var q = require('q');
var sinon = require('sinon');
var Session = require('../src/session');

describe('loading express', function () {
  var server, sandbox;
  beforeEach(function () {
    server = require('../src/server');
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
    server.close();
  });
  xit('responds to /', function testSlash(done) {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('responds to / if user is logged in', function (done) {
    var token = "token";
    var deferred = q.defer();
    var userPromise = deferred.promise;
    sandbox.stub(Session, "currentUser").withArgs(token).returns(userPromise);
    deferred.resolve("username");

    request(server)
      .get('/')
      .set('Cookie', 'AuthSession='+token)
      .expect(200, done);
  });

  it('responds with 401 if cookie is invalid', function(done) {
    var deferred = q.defer();
    var invalidUserPromise = deferred.promise;
    sandbox.stub(Session, "currentUser").withArgs("invalid_token").returns(invalidUserPromise);
    deferred.reject("oops");

    request(server)
      .get('/')
      .set('Cookie', 'AuthSession='+'invalid_token')
      .expect(401, done);
  });

  it('responds with 401 if no cookie is sent', function(done){
    request(server)
      .get('/')
      .expect(401, done);
  });
});