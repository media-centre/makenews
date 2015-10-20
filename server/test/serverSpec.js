var request = require('supertest');
var sinon = require('sinon');
var Session = require('../src/session');

describe('loading express', () => {
  var server, sandbox;
  beforeEach(() => {
    server = require('../src/server');
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
    server.close();
  });

  describe('publicUrls', () => {
    it('responds to / even without cookie', (done) => {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });

  describe('Urls that require login', () =>  {
    it('responds 200 if user is logged in', (done) => {
      var token = "token";
      var userPromise = new Promise((resolve, reject) => {
        resolve("username");
      });
      sandbox.stub(Session, "currentUser").withArgs(token).returns(userPromise);

      request(server)
        .get('/welcome')
        .set('Cookie', 'AuthSession=' + token)
        .expect(200, done);
    });

    it('responds with 401 if cookie is invalid', (done) => {
      var invalidUserPromise = new Promise((resolve, reject) => {
        reject("oops");
      });
      sandbox.stub(Session, "currentUser").withArgs("invalid_token").returns(invalidUserPromise);

      request(server)
        .get('/welcome')
        .set('Cookie', 'AuthSession=' + 'invalid_token')
        .expect(401, done);
    });

    it('responds with 401 if no cookie is sent', (done) => {
      request(server)
        .get('/welcome')
        .expect(401, done);
    });
  });
});