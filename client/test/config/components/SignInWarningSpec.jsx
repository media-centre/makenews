import SignInWarning from "../../../src/js/config/components/SignInWarning";
import { shallow } from "enzyme";
import { expect } from "chai";
import React from "react";

describe("SignInWarning", () => {
    let wrapper = null;
    beforeEach("SignInWarning", () => {
        wrapper = shallow(<SignInWarning currentSourceType="Twitter"/>);
    });
    it("should have div with className sign-in-warning", () => {
        expect(wrapper.node.type).to.equals("div");
        expect(wrapper.node.props.className).to.equals("sign-in-warning");
    });

    it("should have a warning icon with className icon", () => {
        const [icon] = wrapper.node.props.children;
        expect(icon.props.className).to.equals("warning-icon");
        expect(icon.type).to.equals("i");
    });

    it("should have a warning message for facebook with className message", () => {
        wrapper = shallow(<SignInWarning currentSourceType="facebook"/>);
        const [, message] = wrapper.node.props.children;
        expect(message.props.className).to.equals("message");
        expect(message.props.children).to.equals("Please, sign into your facebook account to add Facebook Profiles, Groups, Pages as your sources");
        expect(message.type).to.equals("div");
    });

    it("should have a warning message for twitter with className message", () => {
        const [, message] = wrapper.node.props.children;
        expect(message.props.className).to.equals("message");
        expect(message.props.children).to.equals("Please, sign into your twitter account");
        expect(message.type).to.equals("div");
    });
});


