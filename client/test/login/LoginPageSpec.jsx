/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import "../helper/TestHelper.js";
import { LoginPage } from "../../src/js/login/pages/LoginPage.jsx";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("login page component", () => {
    let loginPage = null;
    before("login page component", () => {
        let props = {
            "login": {
                "errorMessage": "invalid credentials",
                "userName": "test"
            },
            "loginPageStrings": {
                "login": {
                    "loginButton": "Login"
                },
                "branding": {
                    "text": "sample branding"
                },
                "featuresHelp": {
                    "configureHelp": {
                        "name": "Test Configure Name",
                        "text": "sample Configure text"
                    },
                    "surfHelp": {
                        "name": "Test Surf Name",
                        "text": "sample Surf text"
                    },
                    "parkHelp": {
                        "name": "Test Park Name",
                        "text": "sample Park text"
                    }
                }
            }
        };

        loginPage = TestUtils.renderIntoDocument(
            <LoginPage dispatch={()=>{}} login={props.login} loginPageStrings={props.loginPageStrings}/>
        );
    });

    it("should have login component with the errorMessage property", () => {
        let loginDOM = ReactDOM.findDOMNode(loginPage.refs.login);
        assert.strictEqual("login", loginDOM.getAttribute("id"));
        assert.strictEqual("invalid credentials", loginPage.refs.login.props.errorMessage);
    });

    it("should have the property loginPageStrings", () => {
        let loginCompoent = loginPage.refs.login;
        assert.isDefined(loginCompoent.props.loginStrings);
    });

    it("should have props errorMessage as invalid credentials", () => {
        assert.strictEqual("invalid credentials", loginPage.props.login.errorMessage);
    });

    it("should have logo image component", () => {
        let logoDOM = ReactDOM.findDOMNode(loginPage.refs.logo);
        assert.isNotNull(logoDOM);
    });

    it("should have branding component", () => {
        assert.strictEqual("sample branding", loginPage.refs.branding.props.branding.text);
    });

    it("should return user name", () => {
        assert.strictEqual(LoginPage.getUserName(), "test");
    });

    /*intentionally added integration tests*/
    it("should have features help component", () => {
        assert.strictEqual("Test Configure Name", loginPage.refs.featuresHelp.props.featuresHelp.configureHelp.name);
        assert.strictEqual("Test Surf Name", loginPage.refs.featuresHelp.props.featuresHelp.surfHelp.name);
        assert.strictEqual("Test Park Name", loginPage.refs.featuresHelp.props.featuresHelp.parkHelp.name);
    });

});
