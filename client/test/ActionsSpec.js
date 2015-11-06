/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { loginFailed, loginSuccess } from "../src/js/Actions.js";
import { assert } from "chai";

describe("actions", function() {
    it("return type LOGIN_SUCCESS action", function() {
        const userDetails = "test_user";
        const loginSuccessAction = { "type": "LOGIN_SUCCESS", userDetails };
        assert.deepEqual(loginSuccessAction, loginSuccess(userDetails));
    });

    it("return type LOGIN_FAILED action", function() {
        const loginFailedAction = { "type": "LOGIN_FAILED", "responseMessage": "invalid login" };
        assert.deepEqual(loginFailedAction, loginFailed("invalid login"));
    });

});
