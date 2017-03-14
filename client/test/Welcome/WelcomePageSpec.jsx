import React from "react";
import WelcomePage from "./../../src/js/welcome/WelcomePage";
import { expect } from "chai";
import { shallow } from "enzyme";
import { Link } from "react-router";

describe("WelcomePage", () => {
    const welcomeDOM = shallow(<WelcomePage />);

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
