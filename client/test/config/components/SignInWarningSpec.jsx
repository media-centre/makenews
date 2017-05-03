import SignInWarning from "../../../src/js/config/components/SignInWarning";
import { shallow } from "enzyme";
import { expect } from "chai";
import React from "react";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("SignInWarning", () => {
    let wrapper = null;
    const sandbox = sinon.sandbox.create();

    beforeEach("SignInWarning", () => {
        const messages = {
            "facebook": {
                "signInWarning": "Please, sign into your facebook account to add Facebook Groups, Pages as your sources"
            },
            "twitter": {
                "signInWarning": "Please, sign into your twitter account"
            },
            "configurePage": {
                "header": {
                    "signIn": "sign in"
                }
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({ messages });
        wrapper = shallow(<SignInWarning currentSourceType="Twitter"/>);
    });

    afterEach("SignInWarning", () => {
        sandbox.restore();
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
        const messageChildren = message.props.children;
        const [messageContent, button] = messageChildren.props.children;
        expect(message.props.className).to.equals("message");
        expect(messageContent.props.children).to.equals("Please, sign into your facebook account to add Facebook Groups, Pages as your sources");
        expect(messageContent.type).to.equals("div");
        expect(button.type).to.equals("button");
        expect(button.props.className).to.equals("sign-in");
    });

    it("should call fbLogin after clicking sing in button in facebook", () => {
        const fbLogin = sandbox.spy();
        wrapper = shallow(<SignInWarning currentSourceType="facebook" fbLogin={fbLogin}/>);
        const singInButton = wrapper.find(".sign-in");
        singInButton.simulate("click");
        expect(fbLogin.called).to.equals(true);
    });

    it("should have a warning message for twitter with className message", () => {
        const [, message] = wrapper.node.props.children;
        const messageChildren = message.props.children;
        const [messageContent, button] = messageChildren.props.children;
        expect(message.props.className).to.equals("message");
        expect(messageContent.props.children).to.equals("Please, sign into your twitter account");
        expect(messageContent.type).to.equals("div");
        expect(button.type).to.equals("button");
        expect(button.props.className).to.equals("sign-in");
    });
});


