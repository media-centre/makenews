"use strict";

import UserProfile from "../../src/js/user/UserProfile.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../helper/TestHelper.js";
import sinon from "sinon";
import Locale from "../../src/js/utils/Locale";

describe.only("UserProfile", ()=> {
    it("should validate the new password and confirm password", ()=> {
        let sandbox = sinon.sandbox.create();
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "userProfile": {
                    "passwordMisMatch": "New password and ConfirmPassword does not match"
                }
            }
        });
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfile />
        );

        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.confirmPassword.value = "newPassword1";
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        let errorMessage = userProfileDom.querySelector(".error-msg").textContent;
        assert.strictEqual("New password and ConfirmPassword does not match", errorMessage);
        sandbox.restore();
    });

    it("should send the change password request for valid input", ()=> {
        let sandbox = sinon.sandbox.create();
        sandbox.stub(Locale, "applicationStrings").returns({ "messages": { "userProfile": { "currentPassword": "old password", "newPassword": "new password", "confirmPassword": "new password" } } });
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfile/>
        );
        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.confirmPassword.value = "newPassword";
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        sandbox.restore();
    });
});
