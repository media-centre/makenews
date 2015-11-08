import CouchSession from "../src/CouchSession.js";
import {AuthorizationRoutes} from "../src/routes/AuthorizationRoutes.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import request from 'supertest';
import sinon from 'sinon';
import chai from './helpers/chai';


describe("inValidUserInput", function(){

  it("should return true if username is empty", () => {
    const username = "";
    const password = "testPassword";
    let inValidUser = AuthorizationRoutes.inValidUserInput(username, password);
    expect(inValidUser).to.be.ok;
  });

  it("should return true if password is empty", () => {
    const username = "testUser";
    const password = "";
    let inValidUser = AuthorizationRoutes.inValidUserInput(username, password);
    expect(inValidUser).to.be.ok;
  });


  it("should return true if username has whitespaces and with non empty password", () => {
    const username = "      ";
    const password = "testPassword";
    let inValidUser = AuthorizationRoutes.inValidUserInput(username, password);
    expect(inValidUser).to.be.ok;
  });


  it("should return false if username and password are not empty", () => {
    const username = "testUser";
    const password = "testPassword";
    let inValidUser = AuthorizationRoutes.inValidUserInput(username, password);
    expect(inValidUser).to.be.not.ok;
  });
});

describe("handleInvalidInput", () => {
  it("should set the response status to unauthorized", () => {
    let response = {
      "status": function(data){
        expect(data).to.equal(HttpResponseHandler.codes.UNAUTHORIZED);
        return response;
      },
      "json": function (data) {
        expect(data).to.deep.equal({"message": "invalid user or password"});
      }
    }
    AuthorizationRoutes.handleInvalidInput(response);
  });
});

describe("handleLoginSuccess", function(){
  it("should set the token as cookie", () => {
    const token="test_token";
    let response = {
      "status": function(data){
        expect(data).to.equal(HttpResponseHandler.codes.OK);
        return response;
      },
      "append": function(cookieName, receivedToken){
        expect("Set-Cookie").to.equal(cookieName);
        expect(token).to.equal(receivedToken);
        return response;
      },
      "json": function (data) {
        expect(data).to.deep.equal({"message": "login successful"});
      }
    }
    AuthorizationRoutes.handleLoginSuccess(response, token);
  });

});

describe("handleLoginFailure", function(){
  it("should set the response status as unauthorized", () => {
    const token="test_token";
    let response = {
      "status": function(data){
        expect(data).to.equal(HttpResponseHandler.codes.UNAUTHORIZED);
        return response;
      },
      "json": function (data) {
        expect(data).to.deep.equal({"message": "unauthorized"});
      }
    }
    AuthorizationRoutes.handleLoginFailure(response, token);
  });

});

describe("whiteList", () => {

  it("should return true if the url is in whitelist", () => {
    const url = "/login";
    expect(AuthorizationRoutes.whiteList(url)).to.be.ok;
  });

  it("should return false if the url is not in whitelist", () => {
    const url = "/test";
    expect(AuthorizationRoutes.whiteList(url)).to.be.not.ok;

  });

  it('should validate for the non empty url', () => {
    const url = "";
    try {
      AuthorizationRoutes.whiteList(url);
    }catch(error) {
      expect(error.message).to.equal("url can not be empty");
    }
  });
});

describe("allUrlsCallback", () => {
  let whiteListStub, couchSessionStub, request, nextSpy;

  beforeEach("allUrlsCallback", () => {
    whiteListStub = sinon.stub(AuthorizationRoutes, "whiteList");
    couchSessionStub = sinon.stub(CouchSession, "authenitcate");
    request= {"cookies": {"AuthSession": "test_auth_session"}, "originalUrl": "test_url" };
  });

  afterEach("allUrlsCallback", () => {
    whiteListStub.restore();
    couchSessionStub.restore();
  });

  it('should proceed to nextSpy if the url is in whitelist', () => {
    let nextSpy = sinon.spy();
    whiteListStub.withArgs(request.originalUrl).returns(true);
    AuthorizationRoutes.allUrlsCallback(request, nextSpy);
    expect(nextSpy.called).to.be.ok;
  });

  it('should go through authentication if the url is not in whitelist', () => {
    let nextSpy = sinon.spy();
    let promise = new Promise((resolve) => {
        resolve("test_user");
    });
    whiteListStub.withArgs(request.originalUrl).returns(false);
    couchSessionStub.withArgs(request.cookies.AuthSession).returns(promise);
    AuthorizationRoutes.allUrlsCallback(request, nextSpy);
    expect(nextSpy.called).to.be.not.ok;
  });

  it('should raise authorization error if the token is not valid', () => {
    let nextSpy = sinon.spy();
    whiteListStub.withArgs(request.originalUrl).returns(false);
    couchSessionStub.withArgs(request.cookies.AuthSession).returns(Promise.reject(""));
    AuthorizationRoutes.allUrlsCallback(request, nextSpy);
  });

  it('should raise authorization error if there is no token in request', () => {
    let nextSpy = sinon.spy();
    request= {"cookies": {}, "originalUrl": "test_url" };
    whiteListStub.withArgs(request.originalUrl).returns(false);
    AuthorizationRoutes.allUrlsCallback(request, nextSpy);
    expect(nextSpy.called).to.be.ok;
    expect("unthorized").to.equal(nextSpy.getCall(0).args[0].message);
    expect(HttpResponseHandler.codes.UNAUTHORIZED).to.equal(nextSpy.getCall(0).args[0].status);
  });

});



describe("loginCallback", () => {
  let request, response, inValidUserStub, couchSessionStub, token;

  beforeEach("loginCallback", () => {
    request = {"body": {"username": "test_user", "password": "test_password"}};
    response = {};
    inValidUserStub = sinon.stub(AuthorizationRoutes, "inValidUserInput");
    couchSessionStub = sinon.stub(CouchSession, "login");
    token = "test_token";
  });

  afterEach("loginCallback", () => {
    inValidUserStub.restore();
    couchSessionStub.restore();
  });

  it('should throw error if request is empty', () => {
    try {
      AuthorizationRoutes.loginCallback(null, response);
    } catch (error) {
      expect(error.message).to.equal("request or response can not be empty");
    }
  });

  it('should throw error if response is empty', () => {
    try {
      AuthorizationRoutes.loginCallback(request, null);
    } catch (error) {
      expect(error.message).to.equal("request or response can not be empty");
    }
  });

  it('should handle the error if invalid user name or password received.', () => {
    let handleInputMock = sinon.mock(AuthorizationRoutes).expects("handleInvalidInput");

    inValidUserStub.withArgs(request.body.username, request.body.password).returns(true);
    handleInputMock.withArgs(response);
    AuthorizationRoutes.loginCallback(request, response);
    handleInputMock.verify();
    AuthorizationRoutes.handleInvalidInput.restore();
  });

  it('should handle the success if login is success with the valid user name and password.', () => {

    //let handleLoginSuccessMock = sinon.mock(AuthorizationRoutes).expects("handleLoginSuccess");
    //inValidUserStub.withArgs(request.body.username, request.body.password).returns(false);
    //handleLoginSuccessMock.withArgs(response, token);
    //couchSessionStub.withArgs(request.body.username, request.body.password).returns(Promise.resolve(token));
    //AuthorizationRoutes.loginCallback(request, response);
    //handleLoginSuccessMock.verify();
  });

  it('should handle the failure if login is failed.', () => {
  });

});
