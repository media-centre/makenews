/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { loginFailed, loginSuccess, userLogin, LOGIN_SUCCESS, LOGIN_FAILED } from "../../src/js/login/LoginActions.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import { expect } from "chai";
import sinon from "sinon";
import mockStore from "../helper/ActionHelper.js";

describe("actions", () => {
    it("return type LOGIN_SUCCESS action", function() {
        const userDetails = "test_user";
        const loginSuccessAction = { "type": "LOGIN_SUCCESS", userDetails };
        expect(loginSuccessAction).to.deep.equal(loginSuccess(userDetails));
    });
    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        expect(loginFailedAction).to.deep.equal(loginFailed("invalid login"));
    });

});

describe("userLogin", () => {
    let headers = null, data = null, userName = null, password = null, ajaxPostMock = null;
    beforeEach("userLogin", () => {
        userName = "test_user";
        password = "test_password";
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

    it("should dispatch login successful action if the login is successful", (done) => {
        ajaxPostMock.withArgs(headers, data).returns(Promise.resolve({ "userName": userName }));
        const expectedActions = [
            { "type": LOGIN_SUCCESS, "userDetails": userName }
        ];
        const store = mockStore({ "errorMessage": "" }, expectedActions, done);

        store.dispatch(userLogin(userName, password));
    });

    it("should dispatch login failure action if the login is not successful", (done) => {
        ajaxPostMock.withArgs(headers, data).returns(Promise.reject("error"));
        const expectedActions = [
            { "type": LOGIN_FAILED, "responseMessage": "Invalid user name or password" }
        ];
        const store = mockStore({ "errorMessage": "" }, expectedActions, done);

        store.dispatch(userLogin(userName, password));
    });
});
