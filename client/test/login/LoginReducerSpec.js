/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import "../helper/TestHelper.js";
import { login, loginPageLocale } from "../../src/js/login/LoginReducers.js";
import Locale from "../../src/js/utils/Locale.js";
import { assert } from "chai";
import sinon from "sinon";

describe("login reducer", function() {

    describe("login", () => {
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
            let DocumentMock = sinon.mock(document);

            let testUser = "test_user";
            let action = { "type": "LOGIN_SUCCESS", "history": { }, "userName": testUser };

            let state = login(undefined, action);
            DocumentMock.verify();
            assert.strictEqual("", state.errorMessage);
            assert.strictEqual(testUser, state.userName);
            DocumentMock.restore();
        });
    });
    describe("loginLocale", () => {
        it("should have login page strings in English by default", () => {
            let applicationStrings = {
                "locales": ["en"],

                "messages": {
                    "loginPage": {
                        "login": {
                            "loginButton": "Login"
                        }
                    }
                }
            };
            let applicationStringsMock = sinon.mock(Locale).expects("applicationStrings");
            applicationStringsMock.returns(applicationStrings);
            let loginPageLocales = loginPageLocale();
            assert.strictEqual("Login", loginPageLocales.login.loginButton);
            applicationStringsMock.verify();
            Locale.applicationStrings.restore();
        });
    });
});
