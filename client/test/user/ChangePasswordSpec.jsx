import { ChangePassword } from "./../../src/js/user/ChangePassword";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Locale from "./../../src/js/utils/Locale";
import sinon from "sinon";
import * as HeaderActions from "./../../src/js/header/HeaderActions";

describe("Change Password", () => {
    let changePasswordDom = null;
    const sandbox = sinon.sandbox.create();
    let popup = null;

    beforeEach("Change Password", () => {
        const changePasswordMessages = { "isSuccess": true };
        const dispatch = ()=>{};
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "changePassword": {
                    "passwordUpdateFailure": "Password update failed",
                    "invalidCredentials": "Incorrect Current Password",
                    "newPwdConfirmPwdMismatch": "New Password and Confirm Password do not match",
                    "currentPassword": "current password",
                    "newPassword": "new password",
                    "confirmPassword": "confirm password",
                    "newPwdShouldNotMatchCurrentPwd": "New Password should not be same as the Current Password",
                    "pwdChangeSuccessful": "Password successfully changed",
                    "pwdShouldNotBeEmpty": "Passwords cannot be left blank",
                    "logoutConfirmMessage": "Your password has been successfully changed. The application will now logout. Please re-login with your new password"
                }
            }
        });
        popup = sandbox.mock(HeaderActions).expects("popUp").returns({ "type": "" });
        changePasswordDom = shallow(<ChangePassword changePasswordMessages={changePasswordMessages} dispatch={dispatch}/>);
    });

    afterEach("Change Password", () => {
        sandbox.restore();
    });

    it("should have a change-password div", () => {
        expect(changePasswordDom.node.type).to.equals("div");
        expect(changePasswordDom.node.props.className).to.equals("change-password");
    });

    it("should have a form with changePassword id", () => {
        const form = changePasswordDom.node.props.children;
        expect(form.type).to.equals("form");
        expect(form.props.id).to.equals("changePassword");
    });

    it("should have change password heading", () => {
        const form = changePasswordDom.node.props.children;
        const [heading] = form.props.children;
        expect(heading.type).to.equals("h3");
        expect(heading.props.children).to.equals("Change Password");
    });

    it("should have a error message element", () => {
        const form = changePasswordDom.node.props.children;
        const [, errorMsg] = form.props.children;
        expect(errorMsg.type).to.equals("p");
        expect(errorMsg.props.className).to.equals("error-msg small-text");
    });

    it("should have input box for current password", () => {
        const form = changePasswordDom.node.props.children;
        const [,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("current password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("");
    });

    it("should have input box for new password", () => {
        const form = changePasswordDom.node.props.children;
        const [,,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("new password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("");
    });

    it("should have input box for confirm new password", () => {
        const form = changePasswordDom.node.props.children;
        const [,,,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("confirm password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("");
    });

    it("should have a submit button", () => {
        const form = changePasswordDom.node.props.children;
        const [,,,,, button] = form.props.children;
        expect(button.type).to.equals("button");
        expect(button.props.type).to.equals("submit");
        expect(button.props.className).to.equals("primary");
    });

    it("should dispatch popUp when changePassword confirmed", () => {
        popup.verify();
    });
});
