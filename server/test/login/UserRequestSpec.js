/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import UserRequest from "../../src/login/UserRequest.js";
import CouchSession from "../../src/CouchSession.js";
import LogTestHelper from "../../test/helpers/LogTestHelper";
import sinon from "sinon";

import { assert } from "chai";

describe("UserRequest", () => {
    let userName = null, password = null;
    before("UserRequest", () => {
        userName = "test_user_name";
        password = "test_password";
        sinon.stub(UserRequest, "logger").returns(LogTestHelper.instance());
    });

    after("UserRequest", () => {
        UserRequest.logger.restore();
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

    describe("updatePassword", () => {
        let sandbox = null, couchSessionUpdatePasswordStub = null, sessionCookie = null;
        beforeEach("updatePassword", () => {
            sessionCookie = "AuthSession=test_token; Version=1; Path=/; HttpOnly";
            sandbox = sinon.sandbox.create();
        });
        afterEach("updatePassword", () => {
            sandbox.restore();
        });
        it("should update the password if old passwords is correct", (done) => {
            let username = "test";
            let oldPassword = "old_password", newPassword = "new_password", cofirmPassword = "new_password";

            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            sandbox.stub(CouchSession, "login").withArgs(username, oldPassword).returns(Promise.resolve(sessionCookie));
            couchSessionUpdatePasswordStub.withArgs(username, newPassword, "test_token").returns(Promise.resolve({ "body": { "ok": true, "id": "org.couchdb.user:test", "rev": "new revision" } }));

            new UserRequest(username, password).updatePassword(oldPassword, newPassword, cofirmPassword).then((response) => {
                assert.deepEqual(response.body.ok, true);
                done();
            });
        });

        it("should not update the password if old password is incorrect", (done) => {
            let username = "test";
            let oldPassword = "old_password", newPassword = "new_password", cofirmPassword = "new_password";

            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            sandbox.stub(CouchSession, "login").withArgs(username, oldPassword).returns(Promise.reject("Login failed"));

            new UserRequest(username, password).updatePassword(oldPassword, newPassword, cofirmPassword).catch(error =>{
                assert.strictEqual("login failed", error);
                done();
            });
        });
        it("should not update the password when couchdb password updation fails", (done) => {
            let username = "test";
            let oldPassword = "old_password", newPassword = "new_password", cofirmPassword = "new_password";

            couchSessionUpdatePasswordStub = sandbox.stub(CouchSession, "updatePassword");
            sandbox.stub(CouchSession, "login").withArgs(username, oldPassword).returns(Promise.resolve(sessionCookie));
            couchSessionUpdatePasswordStub.withArgs(username, newPassword, "test_token").returns(Promise.reject("Updation failed"));

            new UserRequest(username, password).updatePassword(oldPassword, newPassword, cofirmPassword).catch(error =>{
                assert.strictEqual("Updation failed", error);
                done();
            });
        });
    });
});

