import React from "react";
import WelcomePage from "./../../src/js/welcome/WelcomePage";
import AppSessionStorage from "./../../src/js/utils/AppSessionStorage";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Link } from "react-router";
import sinon from "sinon";
import Locale from "./../../src/js/utils/Locale";

describe("WelcomePage", () => {
    const sandbox = sinon.sandbox.create();
    let welcomeDOM = null;

    beforeEach("WelcomePage", () => {
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "welcomePage": {
                    "heading": "Hello",
                    "message": "Welcome onboard. Hungry for news? Lets get started to collect and sort your news at one stop. Here are a few things you might want to know.",
                    "nextButton": "Next"
                }
            }
        });
        welcomeDOM = shallow(<WelcomePage />);
    });

    afterEach("WelcomePage", () => {
        sandbox.restore();
    });

    it("should have a root div with welcome-page class", () => {
        expect(welcomeDOM.node.type).to.equals("div");
        expect(welcomeDOM.node.props.className).to.equals("welcome-page");
    });

    it("should have the logo image", () => {
        const logo = welcomeDOM.find(".logo");
        expect(logo).to.have.length(1); //eslint-disable-line no-magic-numbers
        expect(logo.node.type).to.equals("img");
        expect(logo.props().src).to.equals("./images/makenews-logo.png");
        expect(logo.props().alt).to.equals("makenews logo");
    });

    it("should have welcome message div", () => {
        expect(welcomeDOM.find(".welcome-message")).to.have.length(1); //eslint-disable-line no-magic-numbers
    });

    it("should have the Hello username text", () => {
        const hello = welcomeDOM.find(".welcome-user");
        expect(hello.text()).to.equals("Hello user,");
    });

    it("should have the Hello Murali text when the username is Murali", () => {
        const appSessionStorage = AppSessionStorage.instance();
        sinon.stub(AppSessionStorage, "instance").returns(appSessionStorage);
        sinon.stub(appSessionStorage, "getValue").returns("Murali");

        const hello = shallow(<WelcomePage />).find(".welcome-user");
        expect(hello.text()).to.equals("Hello Murali,");

        AppSessionStorage.instance.restore();
        appSessionStorage.getValue.restore();
    });
    
    it("should have a introduction", () => {
        const desc = welcomeDOM.find(".intro");
        expect(desc.node.type).to.equals("p");
        expect(desc.text()).to.equals("Welcome onboard. Hungry for news? Lets get started to collect and sort your news at one stop. Here are a few things you might want to know.");
    });

    it("should have a Link to /configure-intro ", () => {
        const link = welcomeDOM.find(Link);
        expect(link.props().to).to.equals("/configure-intro");
    });

    it("should have a arrow icon in the footer link", () => {
        const icon = welcomeDOM.find("footer i");
        expect(icon.node.props.className).to.equals("fa fa-arrow-right");
    });
});
