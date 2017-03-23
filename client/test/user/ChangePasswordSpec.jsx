import { ChangePassword } from "./../../src/js/user/ChangePassword";
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";

describe("Change Password", () => {
    let changePasswordDom = null;
    beforeEach("Change Password", () => {
        const changePasswordMessages = {};
        const userProfileStrings = {};
        const dispatch = ()=>{};
        changePasswordDom = shallow(<ChangePassword changePasswordMessages={changePasswordMessages} userProfileStrings={userProfileStrings} dispatch={dispatch}/>);
    });

    it("should have a change-password div", () => {
        expect(changePasswordDom.node.type).to.equals("div");
        expect(changePasswordDom.node.props.className).to.equals("change-password");
    });

    it("should have a change-password div", () => {
        const [form] = changePasswordDom.node.props.children;
        expect(form.type).to.equals("form");
        expect(form.props.id).to.equals("changePassword");
    });

    it("should have change password heading", () => {
        const [form] = changePasswordDom.node.props.children;
        const [heading] = form.props.children;
        expect(heading.type).to.equals("h3");
        expect(heading.props.children).to.equals("Change Password");
    });

    it("should have a error message element", () => {
        const [form] = changePasswordDom.node.props.children;
        const [, errorMsg] = form.props.children;
        expect(errorMsg.type).to.equals("p");
        expect(errorMsg.props.className).to.equals("error-msg small-text");
    });

    it("should have input box for current password", () => {
        const [form] = changePasswordDom.node.props.children;
        const [,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("current password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("error-border ");
    });

    it("should have input box for new password", () => {
        const [form] = changePasswordDom.node.props.children;
        const [,,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("new password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("error-border ");
    });

    it("should have input box for new password", () => {
        const [form] = changePasswordDom.node.props.children;
        const [,,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("new password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("error-border ");
    });

    it("should have input box for confirm new password", () => {
        const [form] = changePasswordDom.node.props.children;
        const [,,,, input] = form.props.children;
        expect(input.type).to.equals("input");
        expect(input.props.name).to.equals("confirm password");
        expect(input.props.required).to.be.true; //eslint-disable-line no-unused-expressions
        expect(input.props.className).to.equals("error-border ");
    });

    it("should have a submit button", () => {
        const [form] = changePasswordDom.node.props.children;
        const [,,,,, button] = form.props.children;
        expect(button.type).to.equals("button");
        expect(button.props.type).to.equals("submit");
        expect(button.props.className).to.equals("primary");
    });
});
