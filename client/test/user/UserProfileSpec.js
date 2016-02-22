"use strict";

import UserProfileSettings from "../../src/js/user/UserProfileSettings.jsx";
import { logout } from "../../src/js/login/LogoutActions";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../helper/TestHelper.js";
import sinon from "sinon";

describe("UserProfileSettings", ()=> {
    it("should toggle the dropdown", ()=> {
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfileSettings />
        );

        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-info-label"));
        assert.isTrue(userProfile.state.show);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-info-label"));
        assert.isFalse(userProfile.state.show);
    });

    it("should close the dropdown on clicking the menu items", ()=> {
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfileSettings />
        );
        userProfile.state.show = true;
        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        TestUtils.Simulate.click(userProfileDom.querySelector("ul li"));
        assert.isFalse(userProfile.state.show);
    });

    xit("should logout the user on clicking logout option", ()=> {
        let userProfile = TestUtils.renderIntoDocument(
            <UserProfileSettings />
        );
        userProfile.state.show = true;


        let logoutMock = sinon.mock(logout);

        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        TestUtils.Simulate.click(userProfileDom.querySelector("ul li"));
        assert.isFalse(userProfile.state.show);

        logoutMock.verify();
        logoutMock.restore();
    });
});
