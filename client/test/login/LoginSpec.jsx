/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import Login from "../../src/js/login/components/Login.jsx";

import sinon from "sinon";
import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../helper/TestHelper";

describe("login component", () => {
    let onSubmitCallback = null, loginComponent = null, loginStrings = null;

    before("render and locate element", () => {
        loginStrings = {
            "loginButton": "TestLogin",
            "userNamePlaceHoder": "enUser",
            "passwordPlaceHoder": "enPassword"
        };
        onSubmitCallback = sinon.spy();
        loginComponent = TestUtils.renderIntoDocument(
            <Login onLoginClick={(userName, password) => onSubmitCallback(userName, password)} loginStrings={loginStrings} errorMessage={""} />
        );
    });

    it("should display the login button string from locale string", () => {
        let buttonElementDOM = ReactDOM.findDOMNode(loginComponent.refs.submit);
        assert.strictEqual("TestLogin", buttonElementDOM.innerHTML);
    });

    it("user name element type should be text", () => {
        let userNameInputDOM = ReactDOM.findDOMNode(loginComponent.refs.userName);
        assert.strictEqual("text", userNameInputDOM.getAttribute("type"), "user name element type is not a text");
    });

    it("password element type should be password", () => {
        let passwordInputDOM = ReactDOM.findDOMNode(loginComponent.refs.password);
        assert.strictEqual("password", passwordInputDOM.getAttribute("type"), "password element type is not a password");
    });

    it("error message should be empty", () => {
        let errorElementDOM = ReactDOM.findDOMNode(loginComponent.refs.errorMessage);
        assert.strictEqual("", errorElementDOM.innerHTML, "error message is not empty");
    });

    it("error message should be invalid credentials", () => {
        let anotherLoginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => onSubmitCallback(userName, password)} loginStrings={loginStrings} errorMessage={"invalid credentials"} />
    );
        let errorElementDOM = ReactDOM.findDOMNode(anotherLoginComponent.refs.errorMessage);
        assert.strictEqual("invalid credentials", errorElementDOM.innerHTML, "unexpected error message received");
    });

    it("submit button click should call login action call back", () => {
        let anotherLoginComponent = TestUtils.renderIntoDocument(
        <Login onLoginClick={(userName, password) => onSubmitCallback(userName, password)} loginStrings={loginStrings} errorMessage={""} />
    );

        let buttonElementDOM = ReactDOM.findDOMNode(anotherLoginComponent.refs.submit);
        TestUtils.Simulate.submit(buttonElementDOM);
        assert.isTrue(onSubmitCallback.called);
    });

    it("should display the login button string from locale string", () => {
        let buttonElementDOM = ReactDOM.findDOMNode(loginComponent.refs.submit);
        assert.strictEqual("TestLogin", buttonElementDOM.innerHTML);
    });

    it("should display the login username string from locale string", () => {
        let userNameInputDOM = ReactDOM.findDOMNode(loginComponent.refs.userName);
        assert.strictEqual("enUser", userNameInputDOM.getAttribute("placeholder"));
    });
    it("should display the login password string from locale string", () => {
        let passwordInputDOM = ReactDOM.findDOMNode(loginComponent.refs.password);
        assert.strictEqual("enPassword", passwordInputDOM.getAttribute("placeholder"));
    });
});
