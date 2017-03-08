import "../helper/TestHelper";
import { LoginPage } from "../../src/js/login/pages/LoginPage";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("login page component", () => {
    let loginPage = null;
    before("login page component", () => {
        const props = {
            "login": {
                "errorMessage": "invalid credentials"
            },
            "loginPageStrings": {
                "login": {
                    "loginButton": "Login"
                },
                "branding": {
                    "text": "sample branding"
                }
            }
        };

        loginPage = TestUtils.renderIntoDocument(
            <LoginPage dispatch={()=>{}} login={props.login} loginPageStrings={props.loginPageStrings}/>
        );
    });

    it("should have login component with the errorMessage property", () => {
        const loginDOM = ReactDOM.findDOMNode(loginPage.refs.login);
        assert.strictEqual(loginDOM.className, "login");
        assert.strictEqual("invalid credentials", loginPage.refs.login.props.errorMessage);
    });

    it("should have the property loginPageStrings", () => {
        const loginCompoent = loginPage.refs.login;
        assert.isDefined(loginCompoent.props.loginStrings);
    });

    it("should have props errorMessage as invalid credentials", () => {
        assert.strictEqual("invalid credentials", loginPage.props.login.errorMessage);
    });
});
