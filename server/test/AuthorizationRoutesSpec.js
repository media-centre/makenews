import request from 'supertest';
import sinon from 'sinon';
import Session from '../src/session';
import server from '../../server';

describe('AuthorizationRoutesSpec', () => {
  var sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('publicUrls', () => {
    it('responds to / even without cookie', (done) => {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });

  describe('Urls that require login', () => {
    it('responds 200 if user is logged in', (done) => {
      var token = "token";
      var userPromise = new Promise((resolve) => {
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

  describe('login', () => {
    it('should login and return token from couch on success', (done) => {
      var userCredentials = {username: 'marcus', password: 'password'};
      var cookie = "AuthSession=token";
      var cookiePromise = new Promise((resolve) => {
        resolve(cookie);
      });
      sandbox.stub(Session, "login").withArgs(userCredentials.username, userCredentials.password).returns(cookiePromise);
      request(server)
        .post('/login')
        .send(userCredentials)
        .expect(200)
        .expect('Set-Cookie', cookie, done);
    });

    it('should return error json on invalid login', (done) => {
      var userCredentials = {username: 'invalid_username', password: 'password'};
      var rejectedPromise = new Promise((resolve, reject) => {
        reject("err");
      });
      sandbox.stub(Session, "login").withArgs(userCredentials.username, userCredentials.password).returns(rejectedPromise);
      request(server)
        .post('/login')
        .send(userCredentials)
        .expect(401)
        .expect({"status":"error", "message": "unauthorized"}, done);
    });

    it('should return error json if username is empty', (done) => {
      var userCredentials = {username: "", password: 'password'};
      request(server)
        .post('/login')
        .send(userCredentials)
        .expect(401)
        .expect({"status":"error", "message": "cannot be blank"}, done);
    });

    it('should return error json if password is empty', (done) => {
      var userCredentials = {username: "username", password: ''};
      request(server)
        .post('/login')
        .send(userCredentials)
        .expect(401)
        .expect({"status":"error", "message": "cannot be blank"}, done);
    });
  });
});