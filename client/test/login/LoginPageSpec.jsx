import "../helper/TestHelper";
import { LoginPage } from "../../src/js/login/pages/LoginPage";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("login page component", () => {
    let loginPage = null;
    let loginPageDOM = null;
    before("login page component", () => {
        const props = {
            "login": {
                "errorMessage": "invalid credentials"
            },
            "loginPageStrings": {
                "login": {
                    "loginButton": "Login"
                },
                "getStarted": "get started for free",
                "watchDemo": "Watch Makenews Demo",
                "branding": {
                    "text": "sample branding"
                }
            }
        };

        loginPage = TestUtils.renderIntoDocument(
            <LoginPage dispatch={()=>{}} login={props.login} loginPageStrings={props.loginPageStrings}/>
        );

        loginPageDOM = ReactDOM.findDOMNode(loginPage);
    });

    it("should have a logo image", () => {
        const [img] = loginPageDOM.querySelectorAll("img.logo");
        assert.strictEqual(img.src, "./images/makenews-logo.png");
        assert.strictEqual(img.alt, "makenews");
    });

    it("should have the makenews description", () => {
        const [desc] = loginPageDOM.querySelectorAll(".makenews-desc");
        assert.strictEqual(desc.textContent, "sample branding");
    });

    it("should have the getStarted button", () => {
        const [button] = loginPageDOM.querySelectorAll(".get-started.btn");
        assert.strictEqual(button.textContent, "get started for free");
    });

    it("should have a watch makenews demo link", () => {
        const [link] = loginPageDOM.querySelectorAll(".watch-demo");
        assert.strictEqual(link.textContent, "Watch Makenews Demo");
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
