"use strict";

import UserProfileSettings from "../../src/js/user/UserProfileSettings.jsx";
import LogoutActions from "../../src/js/login/LogoutActions";
import History from "../../src/js/History";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../helper/TestHelper.js";
import sinon from "sinon";
import Locale from "../../src/js/utils/Locale";

describe("UserProfileSettings", ()=> {
    let sandbox = null, userProfile = null;
    beforeEach("UserProfileSettings", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "userProfileSettings": {}
            }
        });
        sandbox.stub(localStorage, "getItem").withArgs("UserName").returns("test");

        userProfile = TestUtils.renderIntoDocument(
            <UserProfileSettings />
        );
    });

    afterEach("UserProfileSettings", () => {
        sandbox.restore();
    });

    it("should toggle the dropdown", ()=> {
        let userProfileDom = ReactDOM.findDOMNode(userProfile);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-info-label"));
        assert.isTrue(userProfile.state.show);
        TestUtils.Simulate.click(userProfileDom.querySelector(".user-info-label"));
        assert.isFalse(userProfile.state.show);
    });

    it("should close the dropdown on clicking the menu items", ()=> {
        userProfile.state.show = true;
        TestUtils.Simulate.click(userProfile.refs.updateProfile);
        assert.isFalse(userProfile.state.show);
    });

    it("should logout the user on clicking logout option", ()=> {
        userProfile.state.show = true;
        let logoutActions = new LogoutActions();
        sandbox.stub(LogoutActions, "instance").returns(logoutActions);
        let logoutMock = sandbox.mock(logoutActions).expects("logout");

        TestUtils.Simulate.click(userProfile.refs.logout);

        assert.isFalse(userProfile.state.show);
        logoutMock.verify();
    });

    it("should open help on clicking help option", ()=> {
        userProfile.state.show = true;
        let history = { "push": () => {} };
        sandbox.mock(History).expects("getHistory").returns(history);
        let pushMock = sandbox.mock(history).expects("push").withArgs("/help");
        TestUtils.Simulate.click(userProfile.refs.help);

        assert.isFalse(userProfile.state.show);
        pushMock.verify();
    });
});
