import React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import ConfigurationIntro from "./../../src/js/welcome/ConfigurationIntro";
import History from "./../../src/js/History";
import sinon from "sinon";

describe("ConfigurationIntro", () => {
    const wrapper = shallow(<ConfigurationIntro />);

    it("should have a root div with welcome-page class", () => {
        expect(wrapper.node.type).to.equals("div");
        expect(wrapper.node.props.className).to.equals("welcome-page");
    });

    it("should have the logo image", () => {
        const logo = wrapper.find(".logo");
        expect(logo).to.have.length(1); //eslint-disable-line no-magic-numbers
        expect(logo.node.type).to.equals("img");
        expect(logo.props().src).to.equals("./images/makenews-logo.png");
        expect(logo.props().alt).to.equals("makenews logo");
    });

    it("should have welcome message div", () => {
        expect(wrapper.find(".welcome-message")).to.have.length(1); //eslint-disable-line no-magic-numbers
    });

    it("should have the intro message", () => {
        expect(wrapper.find(".intro").text()).to.equals("To view your news at one stop you can configure all your key sources and aggregate them on Makenews.");
    });

    it("should have a sources div", () => {
        expect(wrapper.find(".sources").node.type).to.equals("div");
    });

    it("should have web source icon and text", () => {
        const [web] = wrapper.find(".source").nodes;
        expect(web.type).to.equals("span");

        const [icon, text] = web.props.children;
        expect(icon.props.className).to.equals("fa fa-web");
        expect(text).to.equals(" Web");
    });

    it("should have facebook source icon and text", () => {
        const [, facebook] = wrapper.find(".source").nodes;
        expect(facebook.type).to.equals("span");

        const [icon, text] = facebook.props.children;
        expect(icon.props.className).to.equals("fa fa-facebook");
        expect(text).to.equals(" Facebook");
    });

    it("should have twitter source icon and text", () => {
        const [, , twitter] = wrapper.find(".source").nodes;
        expect(twitter.type).to.equals("span");

        const [icon, text] = twitter.props.children;
        expect(icon.props.className).to.equals("fa fa-twitter");
        expect(text).to.equals(" Twitter");
    });

    it("should have a button for Get Started", () => {
        const link = wrapper.find(".makenews-desc-link");
        expect(link.node.type).to.equals("button");

        const [,, text] = link.node.props.children.props.children;
        expect(text).to.equals(" Get Started ");
    });

    it("should go to /configure/web after clicking on Get Started button", () => {
        const sandbox = sinon.sandbox.create();
        const historyPushSpy = sandbox.spy();
        sandbox.stub(History, "getHistory").returns({ "push": historyPushSpy });
        const configIntroDOM = shallow(<ConfigurationIntro />);
        const link = configIntroDOM.find(".makenews-desc-link");

        link.simulate("click");

        expect(historyPushSpy.calledWith("/configure/web")).to.be.true; //eslint-disable-line no-unused-expressions

        sandbox.restore();
    });

    it("should have a arrow icon in the footer link", () => {
        const icon = wrapper.find("footer .makenews-desc-link i");
        expect(icon.node.props.className).to.equals("fa fa-arrow-right");
    });
});
