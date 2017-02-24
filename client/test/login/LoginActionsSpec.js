/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import { loginFailed, loginSuccess, userLogin, LOGIN_SUCCESS, LOGIN_FAILED } from "../../src/js/login/LoginActions";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import UserSession from "../../src/js/user/UserSession";
import { expect } from "chai";
import sinon from "sinon";
import mockStore from "../helper/ActionHelper";

describe("actions", () => {
    it("return type LOGIN_SUCCESS action", function() {
        const loginSuccessAction = { "type": "LOGIN_SUCCESS" };
        expect(loginSuccessAction).to.deep.equal(loginSuccess());
    });
    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        expect(loginFailedAction).to.deep.equal(loginFailed("invalid login"));
    });

});

describe("userLogin", () => {
    let headers = null, data = null, userName = null, password = null, ajaxInstanceMock = null, ajaxPostMock = null, history = null, sandbox = null;
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
        ajaxInstanceMock = sandbox.mock(AjaxClient);
        ajaxInstanceMock.expects("instance").withArgs("/login").returns(ajaxInstance);
        ajaxPostMock = sandbox.mock(ajaxInstance).expects("post");
    });

    afterEach("userLogin", () => {
        ajaxPostMock.verify();
        sandbox.restore();
    });

    describe("success", () => {
        let historyMock = null, userSessionMock = null, sources = { "web": [], "facebook": [], "twitter": [{ "_id": "123" }] };
        beforeEach("userLogin", () => {
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);

            let userSession = new UserSession();
            sandbox.stub(UserSession, "instance").returns(userSession);
            userSessionMock = sandbox.mock(userSession).expects("init");
            historyMock = sandbox.mock(history).expects("push");
            let configAjaxInstance = new AjaxClient("/configure-sources", true);
            ajaxInstanceMock.expects("instance").withArgs("/configure-sources").returns(configAjaxInstance);
            sandbox.stub(configAjaxInstance, "get").returns(Promise.resolve(sources));
        });

        afterEach("userLogin", () => {
            userSessionMock.verify();
            historyMock.verify();
        });

        it("should dispatch login successful action if the login is successful", (done) => {
            ajaxPostMock.withArgs(headers, data).returns(Promise.resolve());
            historyMock.withArgs("/newsBoard");

            const expectedActions = [
                { "type": LOGIN_SUCCESS },
                { "type": "GOT_CONFIGURED_SOURCES", "sources": sources }
            ];

            const store = mockStore({ "errorMessage": "" }, expectedActions, done);
            store.dispatch(userLogin(history, userName, password));
        });

        it("should not set taken tour if user already taken tour", (done) => {
            ajaxPostMock.withArgs(headers, data).returns(Promise.resolve({ "userName": userName, "dbParameters": { "remoteDbUrl": "http://localhost:5984" } }));
            historyMock.withArgs("/newsBoard");
            const expectedActions = [
                { "type": LOGIN_SUCCESS },
                { "type": "GOT_CONFIGURED_SOURCES", "sources": sources }
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
