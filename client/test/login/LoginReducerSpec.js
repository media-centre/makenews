/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import "../helper/TestHelper.js";
import DbParameters from "../../src/js/db/config/DbParameters.js";
import DbSession from "../../src/js/db/DbSession.js";
import { login } from "../../src/js/login/LoginReducers.js";
import { assert } from "chai";
import sinon from "sinon";

describe("login reducer", function() {

    it("default state if action type is not handled", function() {
        let action = { "type": "undefined" };
        let state = login(undefined, action);
        assert.deepEqual({ "errorMessage": "" }, state);
    });

    it("should return error message incase of login failure", function() {
        let action = { "type": "LOGIN_FAILED", "responseMessage": "login failed" };
        let state = login(undefined, action);
        assert.strictEqual("login failed", state.errorMessage);
    });

    it("should set the user session details when the login is successful", function() {
        let tempNavigation = { "click": () => { } };
        let DocumentMock = sinon.mock(document);

        let testUser = "test_user";
        let action = { "type": "LOGIN_SUCCESS", "userDetails": testUser };
        DocumentMock.expects("getElementById").withArgs("temp-navigation").returns(tempNavigation);

        let state = login(undefined, action);
        DocumentMock.verify();
        assert.strictEqual("", state.errorMessage);
        assert.strictEqual(testUser, state.userName);
        DocumentMock.restore();
    });
});
