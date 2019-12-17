/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

import "../helper/TestHelper";
import { login, loginPageLocale } from "../../src/js/login/LoginReducers";
import Locale from "../../src/js/utils/Locale";
import { assert } from "chai";
import sinon from "sinon";

describe("login reducer", function() {

    describe("login", () => {
        it("default state if action type is not handled", function() {
            const action = { "type": "undefined" };
            const state = login(undefined, action);
            assert.deepEqual({ "errorMessage": "" }, state);
        });

        it("should return error message incase of login failure", function() {
            const action = { "type": "LOGIN_FAILED", "responseMessage": "login failed" };
            const state = login(undefined, action);
            assert.strictEqual("login failed", state.errorMessage);
        });

        it("should set the user session details when the login is successful", function() {
            const DocumentMock = sinon.mock(document);

            const testUser = "test_user";
            const action = { "type": "LOGIN_SUCCESS", "history": { }, "userName": testUser };

            const state = login(undefined, action);
            DocumentMock.verify();
            assert.strictEqual("", state.errorMessage);
            assert.strictEqual(testUser, state.userName);
            DocumentMock.restore();
        });
    });
    describe("loginLocale", () => {
        it("should have login page strings in English by default", () => {
            const applicationStrings = {
                "locales": ["en"],

                "messages": {
                    "loginPage": {
                        "login": {
                            "loginButton": "Login"
                        }
                    }
                }
            };
            const applicationStringsMock = sinon.mock(Locale).expects("applicationStrings");
            applicationStringsMock.returns(applicationStrings);
            const loginPageLocales = loginPageLocale();
            assert.strictEqual("Login", loginPageLocales.login.loginButton);
            applicationStringsMock.verify();
            Locale.applicationStrings.restore();
        });
    });
});
