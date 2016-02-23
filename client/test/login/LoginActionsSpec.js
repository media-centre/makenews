/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { loginFailed, loginSuccess, userLogin, LOGIN_SUCCESS, LOGIN_FAILED } from "../../src/js/login/LoginActions.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage.js";
import UserSession from "../../src/js/user/UserSession.js";
import { expect } from "chai";
import sinon from "sinon";
import mockStore from "../helper/ActionHelper.js";
import DbSession from "../../src/js/db/DbSession.js";

describe("actions", () => {
    it("return type LOGIN_SUCCESS action", function() {
        const userName = "test_user";
        const loginSuccessAction = { "type": "LOGIN_SUCCESS", userName };
        expect(loginSuccessAction).to.deep.equal(loginSuccess(userName));
    });
    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        expect(loginFailedAction).to.deep.equal(loginFailed("invalid login"));
    });

});

describe("userLogin", () => {
    let headers = null, data = null, userName = null, password = null, ajaxPostMock = null, history = null, sandbox = null;
    beforeEach("userLogin", () => {
        userName = "test_user";
        password = "test_password";
        history = { "push": () => {} };
        headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        data = { "username": userName, "password": password };
        sandbox = sinon.sandbox.create();
        let ajaxInstance = new AjaxClient("/login", true);
        let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/login").returns(ajaxInstance);
        ajaxPostMock = sandbox.mock(ajaxInstance).expects("post");
    });

    afterEach("userLogin", () => {
        ajaxPostMock.verify();
        sandbox.restore();
    });

    describe("success", () => {
        let dbSessionInstanceMock = null, historyMock = null, appSessionStorageClearMock = null, userSessionMock = null;
        beforeEach("userLogin", () => {
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            appSessionStorageClearMock = sandbox.mock(appSessionStorage).expects("setValue").twice();

            let userSession = new UserSession();
            sandbox.stub(UserSession, "instance").returns(userSession);
            userSessionMock = sandbox.mock(userSession).expects("setLastAccessedTime");
            dbSessionInstanceMock = sandbox.mock(DbSession).expects("instance");
            historyMock = sandbox.mock(history).expects("push");
        });

        afterEach("userLogin", () => {
            appSessionStorageClearMock.verify();
            userSessionMock.verify();
            dbSessionInstanceMock.verify();
            historyMock.verify();
        });

        it("should dispatch login successful action if the login is successful", (done) => {
            ajaxPostMock.withArgs(headers, data).returns(Promise.resolve({ "userName": userName, "dbParameters": { "remoteDbUrl": "http://localhost:5984" } }));
            dbSessionInstanceMock.returns(Promise.resolve({}));
            historyMock.withArgs("/surf");
            const expectedActions = [
                { "type": LOGIN_SUCCESS, "userName": userName }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(userLogin(history, userName, password));
        });
    });

    describe("failure", () => {
        it("should dispatch login failure action if the login is not successful", (done) => {
            ajaxPostMock.withArgs(headers, data).returns(Promise.reject("error"));
            const expectedActions = [
                { "type": LOGIN_FAILED, "responseMessage": "Invalid user name or password" }
            ];
            const store = mockStore({ "errorMessage": "" }, expectedActions, done);

            store.dispatch(userLogin(history, userName, password));
        });
    });
});
