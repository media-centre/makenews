/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import Login from "../../src/js/login/components/Login.jsx";

import sinon from "sinon";
import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../helper/TestHelper";

describe("login component", () => {
    let onSubmitCallback = null;
    let loginComponent = null;
    let loginStrings = null;

    before("render and locate element", () => {
        loginStrings = {
            "loginButton": "Sign in",
            "userNamePlaceHolder": "enUser",
            "passwordPlaceHolder": "enPassword"
        };
        onSubmitCallback = sinon.spy();
        loginComponent = TestUtils.renderIntoDocument(
            <Login onLoginClick={onSubmitCallback} loginStrings={loginStrings} errorMessage={""} />
        );
    });

    it("should display the login button string from locale string", () => {
        const buttonElementDOM = ReactDOM.findDOMNode(loginComponent.refs.submit);
        assert.strictEqual(buttonElementDOM.innerHTML, "Sign in");
    });

    it("user name element type should be text", () => {
        const userNameInputDOM = ReactDOM.findDOMNode(loginComponent.refs.userName);
        assert.strictEqual(userNameInputDOM.getAttribute("type"), "text", "user name element type is not a text");
    });

    it("password element type should be password", () => {
        const passwordInputDOM = ReactDOM.findDOMNode(loginComponent.refs.password);
        assert.strictEqual(passwordInputDOM.getAttribute("type"), "password", "password element type is not a password");
    });

    it("error message should be empty", () => {
        const errorElementDOM = ReactDOM.findDOMNode(loginComponent.refs.errorMessage);
        assert.strictEqual(errorElementDOM.innerHTML, "", "error message is not empty");
    });

    it("error message should be invalid credentials", () => {
        const anotherLoginComponent = TestUtils.renderIntoDocument(
            <Login onLoginClick={onSubmitCallback} loginStrings={loginStrings} errorMessage={"invalid credentials"} />
        );
        const errorElementDOM = ReactDOM.findDOMNode(anotherLoginComponent.refs.errorMessage);
        assert.strictEqual(errorElementDOM.innerHTML, "invalid credentials", "unexpected error message received");
    });

    it("submit button click should call login action call back", () => {
        const anotherLoginComponent = TestUtils.renderIntoDocument(
            <Login onLoginClick={onSubmitCallback} loginStrings={loginStrings} errorMessage={""} />
        );

        const buttonElementDOM = ReactDOM.findDOMNode(anotherLoginComponent.refs.submit);
        TestUtils.Simulate.submit(buttonElementDOM);
        assert.isTrue(onSubmitCallback.called);
    });

    it("should display the login username string from locale string", () => {
        const userNameInputDOM = ReactDOM.findDOMNode(loginComponent.refs.userName);
        assert.strictEqual(userNameInputDOM.getAttribute("placeholder"), "enUser");
    });
    it("should display the login password string from locale string", () => {
        const passwordInputDOM = ReactDOM.findDOMNode(loginComponent.refs.password);
        assert.strictEqual(passwordInputDOM.getAttribute("placeholder"), "enPassword");
    });
});
