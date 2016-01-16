/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { loginFailed, loginSuccess, userLogin, LOGIN_SUCCESS, LOGIN_FAILED } from "../../src/js/login/LoginActions.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import { expect } from "chai";
import sinon from "sinon";
import mockStore from "../helper/ActionHelper.js";
import DbParameters from "../../src/js/db/DbParameters.js";
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
    let headers = null, data = null, userName = null, password = null, ajaxPostMock = null, history = null;
    beforeEach("userLogin", () => {
        userName = "test_user";
        password = "test_password";
        history = { "push": () => {} };
        headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        data = { "username": userName, "password": password };
        ajaxPostMock = sinon.mock(AjaxClient.prototype).expects("post");
    });

    afterEach("userLogin", () => {
        ajaxPostMock.verify();
        AjaxClient.prototype.post.restore();
    });

    xit("should dispatch login successful action if the login is successful", (done) => {
        let dbParametersInstanceMock = sinon.mock(DbParameters).expects("instance");
        dbParametersInstanceMock.withArgs(userName, "http://localhost:5984");

        let dbSessionInstanceMock = sinon.mock(DbSession).expects("instance");
        dbSessionInstanceMock.returns(Promise.resolve({}));

        ajaxPostMock.withArgs(headers, data).returns(Promise.resolve({ "userName": userName, "dbParameters": { "remoteDbUrl": "http://localhost:5984" } }));
        const expectedActions = [
            { "type": LOGIN_SUCCESS, "userName": userName }
        ];
        sinon.mock(history).expects("push").withArgs("/surf");
        const store = mockStore({ "errorMessage": "" }, expectedActions, done);
        store.dispatch(userLogin(history, userName, password));
        dbParametersInstanceMock.verify();
        dbSessionInstanceMock.verify();
        history.push.restore();
        DbSession.instance.restore();
        DbParameters.instance.restore();
    });

    it("should dispatch login failure action if the login is not successful", (done) => {
        ajaxPostMock.withArgs(headers, data).returns(Promise.reject("error"));
        const expectedActions = [
            { "type": LOGIN_FAILED, "responseMessage": "Invalid user name or password" }
        ];
        const store = mockStore({ "errorMessage": "" }, expectedActions, done);

        store.dispatch(userLogin(history, userName, password));
    });
});
