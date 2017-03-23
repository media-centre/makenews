import UserProfile from "../../../src/js/header/components/UserProfile";
import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import sinon from "sinon";
import LogoutActions from "./../../../src/js/login/LogoutActions";

describe("UserProfile", () => {
    let userProfileDom = null;
    const sandbox = sinon.sandbox.create();
    beforeEach("UserProfile", () => {
        userProfileDom = shallow(<UserProfile />);
    });

    afterEach("UserProfile", () => {
        sandbox.restore();
    });

    it("should have a root element ul with three children", () => {
        expect(userProfileDom.node.type).to.be.equals("ul");
        expect(userProfileDom.node.props.className).to.be.equals("user-profile--dropdown");
        expect(userProfileDom.node.props.children).to.have.lengthOf(3); //eslint-disable-line no-magic-numbers
    });

    it("should have change password element", () => {
        const [changePassword] = userProfileDom.node.props.children;
        const link = changePassword.props.children;
        expect(changePassword.props.className).to.be.equals("user-profile--change-password");
        expect(link.type.displayName).to.be.equals("Link");
        expect(link.props.to).to.be.equals("/change-password");
        expect(link.props.children).to.be.equals("Change Password");
    });

    it("should have help element", () => {
        const [, help] = userProfileDom.node.props.children;
        const link = help.props.children;
        expect(help.props.className).to.be.equals("user-profile--help");
        expect(link.type.displayName).to.be.equals("Link");
        expect(link.props.to).to.be.equals("/help");
        expect(link.props.children).to.be.equals("Help & FAQs");
    });

    it("should have logout element", () => {
        const [,, logout] = userProfileDom.node.props.children;
        const link = logout.props.children;
        expect(logout.props.className).to.be.equals("user-profile--logout");
        expect(link.type).to.be.equals("a");
        expect(link.props.children).to.be.equals("Logout");
    });

    it("should call logout if we click on logout", () => {
        const logoutSpy = sandbox.spy();
        const logoutActions = {
            "logout": logoutSpy
        };

        sandbox.stub(LogoutActions, "instance").returns(logoutActions);
        const link = userProfileDom.find(".user-profile--logout a");
        link.simulate("click");

        expect(logoutSpy.calledOnce).to.be.true; //eslint-disable-line no-unused-expressions
    });
});
