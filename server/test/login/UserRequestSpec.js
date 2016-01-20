/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import UserRequest from "../../src/login/UserRequest.js";
import CouchSession from "../../src/CouchSession.js";
import sinon from "sinon";

import { assert } from "chai";

describe("UserRequest", () => {
    let userName = null, password = null;
    before("UserRequest", () => {
        userName = "test_user_name";
        password = "test_password";
    });

    describe("instance", () => {
        it("should throw the error if user name is empty", () => {
            let userInstanceFn = () => {
                UserRequest.instance("  ", password);
            };
            assert.throw(userInstanceFn, "userName or password cannot be empty");
        });

        it("should throw the error if password is empty", () => {
            let userInstanceFn = () => {
                UserRequest.instance(userName, " ");
            };
            assert.throw(userInstanceFn, "userName or password cannot be empty");
        });

        it("should not throw the error if user name and password are not empty", () => {
            let userInstanceFn = () => {
                UserRequest.instance(userName, password);
            };
            assert.doesNotThrow(userInstanceFn);
        });
    });

    describe("getToken", () => {
        let sessionCooke = null, token = null, couchSessionLoginMock = null;
        beforeEach("getToken", () => {
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            sessionCooke = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
            couchSessionLoginMock = sinon.mock(CouchSession).expects("login");
        });
        afterEach("getToken", () => {
            CouchSession.login.restore();
        });

        it("should give the valid token if valid credentials are given", (done) => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(sessionCooke));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getToken().then(actualToken => {
                assert.strictEqual(token, actualToken);
                couchSessionLoginMock.verify();
                done();
            });
        });

        it("should reject with error if canse of invalid credentials", (done) => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.reject("error"));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getToken().catch(error => {
                assert.strictEqual("login failed", error);
                couchSessionLoginMock.verify();
                done();
            });
        });
    });
    describe("getAuthSessionCookie", () => {
        let sessionCooke = null, couchSessionLoginMock = null;
        beforeEach("getAuthSessionCookie", () => {
            sessionCooke = "AuthSession=dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA; Version=1; Path=/; HttpOnly";
            couchSessionLoginMock = sinon.mock(CouchSession).expects("login");
        });
        afterEach("getAuthSessionCookie", () => {
            CouchSession.login.restore();
        });

        it("should give the auth session cookie if valid credentials are given", (done) => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(sessionCooke));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getAuthSessionCookie().then(actualSessionCookie => {
                assert.strictEqual(sessionCooke, actualSessionCookie);
                couchSessionLoginMock.verify();
                done();
            });
        });

        it("should reject with error if case of invalid credentials", (done) => {
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.reject("error"));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getAuthSessionCookie().catch(error => {
                assert.strictEqual("login failed", error);
                couchSessionLoginMock.verify();
                done();
            });
        });
    });

    describe("getUserName", () => {
        let token = null, couchSessionAuthenticateMock = null;
        beforeEach("getUserName", () => {
            token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
            userName = "test_user_name";
            couchSessionAuthenticateMock = sinon.mock(CouchSession).expects("authenticate");
        });
        afterEach("getUserName", () => {
            CouchSession.authenticate.restore();
        });

        it("should give the user name if the valid token is given", (done) => {
            couchSessionAuthenticateMock.withArgs(token).returns(Promise.resolve(userName));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getUserName(token).then(actualUsserName => {
                assert.strictEqual(userName, actualUsserName);
                couchSessionAuthenticateMock.verify();
                done();
            });
        });

        it("should reject with error if the token is invalid", (done) => {
            couchSessionAuthenticateMock.withArgs(token).returns(Promise.reject("error"));
            let userRequest = UserRequest.instance(userName, password);
            userRequest.getUserName(token).catch(error => {
                assert.strictEqual("can not get the user name", error);
                couchSessionAuthenticateMock.verify();
                done();
            });
        });
    });
});

