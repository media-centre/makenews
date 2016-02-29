"use strict";

import { UserProfile } from "../../src/js/user/UserProfile.jsx";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../helper/TestHelper.js";
import sinon from "sinon";
import { assert } from "chai";
import UserProfileActions from "../../src/js/user/UserProfileActions";
import LogoutActions from "../../src/js/login/LogoutActions";

describe("UserProfile", ()=> {
    let props = null, userProfile = null, sandbox = null, userProfileDom = null, userProfileAction = null;
    beforeEach(()=> {
        sandbox = sinon.sandbox.create();
        props = {
            "changePasswordMessages": {
                "errorMessage": ""
            },
            "userProfileStrings": {
                "userProfile": {
                }
            },
            "dispatch": ()=> {
            }
        };
        userProfile = TestUtils.renderIntoDocument(
            <UserProfile changePasswordMessages={props.changePasswordMessages} userProfileStrings={props.userProfileStrings} dispatch={props.dispatch}/>
        );
        userProfileAction = new UserProfileActions();
        sandbox.mock(UserProfileActions).expects("instance").returns(userProfileAction);
        userProfileDom = ReactDOM.findDOMNode(userProfile);
    });
    afterEach(() => {
        sandbox.restore();
    });
    it("should show error message when new password and confirm do not match", ()=> {
        userProfile.refs.newPassword.value = "newPassword";
        userProfile.refs.currentPassword.value = "oldPassword";
        userProfile.refs.confirmPassword.value = "newPassword1";
        let passwordMock = sandbox.mock(userProfileAction).expects("newPwdConfirmPwdMismatch");
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        passwordMock.verify();
    });

    it("should show error message when old password and new password do not match", ()=>{
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.newPassword.value = "newPassword";
        userProfile.refs.confirmPassword.value = "newPassword";
        let passwordMock = sandbox.mock(userProfileAction).expects("newPasswordShouldNotMatchCurrentPwd");
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        passwordMock.verify();
        assert.isUndefined(userProfile.refs.confirmPopup, "Defined");


    });

    it("should call changepassword when the entered passwords meet the criteria", ()=>{
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.newPassword.value = "newPassword1";
        userProfile.refs.confirmPassword.value = "newPassword1";
        let passwordMock = sandbox.mock(userProfileAction).expects("changePassword");
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        passwordMock.verify();

    });
    it("should show popup when change password is successful", ()=> {
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.newPassword.value = "newPassword1";
        userProfile.refs.confirmPassword.value = "newPassword1";
        props.changePasswordMessages.isSuccess = true;
        userProfile = TestUtils.renderIntoDocument(
            <UserProfile changePasswordMessages={props.changePasswordMessages} userProfileStrings={props.userProfileStrings} dispatch={props.dispatch}/>
        );
        sandbox.mock(userProfileAction).expects("changePassword");
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        assert.isDefined(userProfile.refs.confirmPopup, "Defined");

    });

    it("should logout when confirmed in the popup", ()=> {
        userProfile.refs.currentPassword.value = "newPassword";
        userProfile.refs.newPassword.value = "newPassword1";
        userProfile.refs.confirmPassword.value = "newPassword1";
        props.changePasswordMessages.isSuccess = true;
        userProfile = TestUtils.renderIntoDocument(
            <UserProfile changePasswordMessages={props.changePasswordMessages} userProfileStrings={props.userProfileStrings} dispatch={props.dispatch}/>
        );
        let logoutActions = new LogoutActions();
        sandbox.mock(LogoutActions).expects("instance").returns(logoutActions);
        let logoutMock = sandbox.mock(logoutActions).expects("logout");
        sandbox.mock(userProfileAction).expects("changePassword");
        TestUtils.Simulate.submit(userProfileDom.querySelector("button"));
        TestUtils.Simulate.click(userProfile.refs.confirmPopup.refs.cancelButton);
        logoutMock.verify();
    });

});
