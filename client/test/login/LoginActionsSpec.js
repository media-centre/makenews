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
    xit("should dispatch login successful action if the login is successful", () => {
        let ajaxClient = new AjaxClient("/login");
        let succesData = {"userName": "test"}
        let loginMock = sinon.mock(ajaxClient);
        loginMock.expects("post").returns(succesData);
        let expected = { "type": LOGIN_SUCCESS, succesData };
        expect(userLogin("test", "password")()).to.deep.equal(expected);
        loginMock.verify();
    });

    xit("should dispatch login failure action if the login is not successful", () => {
    });

});

