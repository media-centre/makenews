/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import "./helper/TestHelper.js";
import contentDiscoveryApp from "../src/js/Reducers.js";
import { assert } from "chai";
import sinon from "sinon";
import history from "../src/js/history";

describe("login reducer", function() {

    it("default state if action type is not handled", function() {
        let action = { "type": "undefined" };
        let state = contentDiscoveryApp(undefined, action);
        assert.deepEqual({ "login": { "errorMessage": "" } }, state);
    });

    it("should return error message incase of login failure", function() {
        let action = { "type": "LOGIN_FAILED", "responseMessage": "login failed" };
        let state = contentDiscoveryApp(undefined, action);
        assert.strictEqual("login failed", state.login.errorMessage);
    });

    it("should set sessionStorage with username on success", function() {
        let sandbox = sinon.sandbox.create();
        sandbox.stub(history, "pushState").withArgs(null, "/main");
        let action = { "type": "LOGIN_SUCCESS", "responseMessage": "sdfsdfsd" };
        let state = contentDiscoveryApp(undefined, action);
        assert.strictEqual("successful", state.login.errorMessage);
        assert.strictEqual("loggedIn", localStorage.getItem("userInfo"));
        sandbox.restore();
    });
});
