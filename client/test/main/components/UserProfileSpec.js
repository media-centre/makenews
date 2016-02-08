/* eslint */
"use strict";

import "../../helper/TestHelper.js";
import UserProfile from "../../../src/js/main/components/UserProfile.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("UserProfile", ()=> {
    it("should have settings and logout as options", ()=> {
        let userProfileComponent = TestUtils.renderIntoDocument(
           <UserProfile/>
        );
        assert.isDefined(userProfileComponent.refs.logout, "Logout component is available");
        assert.isDefined(userProfileComponent.refs.updateProfile, "UserSettings component is available");
    });

    it("should hide the dropdown by default", ()=> {
        let userProfileComponent = TestUtils.renderIntoDocument(
            <UserProfile/>
        );
        let userProfileDom = ReactDOM.findDOMNode(userProfileComponent);
        assert.isTrue(userProfileDom.querySelector(".drop-down").classList.contains("hide"));
    });

    it.only("should show the dropdown on clicking settings label", ()=> {
        let userProfileComponent = TestUtils.renderIntoDocument(
            <UserProfile/>
        );
        let userProfileDom = ReactDOM.findDOMNode(userProfileComponent);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-info-label"));
        assert.isFalse(userProfileDom.querySelector(".drop-down").classList.contains("hide"));
    });
});


