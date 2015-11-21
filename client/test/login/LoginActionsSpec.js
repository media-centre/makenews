/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { loginFailed, loginSuccess, userLogin, LOGIN_SUCCESS} from "../../src/js/login/LoginActions.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
import { expect } from "chai";
import sinon from "sinon";

describe("actions", () => {
    it("return type LOGIN_SUCCESS action", function() {
        const userDetails = "test_user";
        const loginSuccessAction = { "type": "LOGIN_SUCCESS", userDetails };
        expect(loginSuccessAction).to.deep.equal(loginSuccess(userDetails));
    });
    let ajaxStub =
    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        expect(loginFailedAction).to.deep.equal(loginFailed("invalid login"));
    });

});

describe("userLogin", () => {
    let headers = null, data = null, userName = null, password = null, ajaxClientInstanceStub = null, route = null, ajaxPostStub = null, ajax = null, dispatch = null;
    beforeEach("userLogin", () => {
        userName = "test_user";
        password = "test_password";
        headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        data = { "username": userName, "password": password };
        ajax = new AjaxClient(route);
        ajaxClientInstanceStub = sinon.stub(AjaxClient, "instance");
        route = "/login";
        ajaxPostStub = sinon.stub(ajax, "post");
        dispatch = sinon.spy();
    });
    afterEach("userLogin", () => {
        AjaxClient.instance.restore();
        ajax.post.restore();
    });
    xit("should dispatch login successful action if the login is successful", () => {
        let loginSuccessMock = sinon.mock(loginSuccess);
        ajaxClientInstanceStub.withArgs(route).returns(ajaxPostStub);
        ajaxPostStub.withArgs(headers, data).returns(Promise.resolve({ "userName": userName }));
        //loginSuccessMock.withArgs(userName).returns({ "type": "LOGIN_SUCCESS", userName });
        dispatch.withArgs({ "type": "LOGIN_SUCCESS", userName });
        userLogin(userName, password)(dispatch);
        loginSuccessMock.verify();
        loginSuccess.restore();
    });

    xit("should dispatch login failure action if the login is not successful", () => {
    });
});
