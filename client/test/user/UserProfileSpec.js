"use strict";

import { UserProfile } from "../../src/js/user/UserProfile.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../helper/TestHelper.js";
import Locale from "../../src/js/utils/Locale";
import sinon from "sinon";

describe("UserProfile", ()=> {
    let props = null;
    xit("should validate the new password and confirm password", ()=> {
        let sandbox = sinon.sandbox.create();
        props = {
            "changePasswordMessages": {
                "errorMessage": ""
            }
        };
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfile changePasswordMessages = {props.changePasswordMessages} />
        );

        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.confirmPassword.value = "newPassword1";
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        let errorMessage = userProfileDom.querySelector(".error-msg").textContent;
        assert.strictEqual("New password and ConfirmPassword does not match", errorMessage);
        sandbox.restore();
    });

    xit("should send the change password request for valid input", ()=> {
        let sandbox = sinon.sandbox.create();
        sandbox.stub(Locale, "applicationStrings").returns({ "messages": { "userProfile": { "currentPassword": "old password", "newPassword": "new password", "confirmPassword": "new password" } } });
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfile changePasswordMessages = {props.changePasswordMessages} />
        );
        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.confirmPassword.value = "newPassword";
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        sandbox.restore();
    });
});
