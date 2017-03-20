import React from "react";
import { ConfigPaneNavigation } from "./../../../src/js/config/components/ConfigPaneNavigation";
import { Link } from "react-router";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";

describe("ConfigPaneNavigation", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("ConfigPaneNavigation", () => {
        sandbox.restore();
    });

    it("should have a nav with class sources-nav", () => {
        const renderer = TestUtils.createRenderer();
        renderer.render(
            <ConfigPaneNavigation currentSourceType="web" sourcesAuthenticationInfo={{ "facebook": false, "twitter": false }} />);
        const nav = renderer.getRenderOutput();

        assert.equal(nav.type, "nav");
        assert.equal(nav.props.className, "sources-nav");
    });

    it("should have /configure/web link for web", () => {
        const configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="web" />);
        const [webLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(webLink.props.to, "/configure/web");
        assert.strictEqual(webLink.props.className, "sources-nav__item active");
        assert.strictEqual(webLink.props.children[1], "Web URLs"); //eslint-disable-line no-magic-numbers
    });

    it("should have /configure/facebook/profiles link for facebook", () => {
        const configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": true, "twitter": false }} />);
        const [, facebookLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(facebookLink.props.to, "/configure/facebook/profiles");
        assert.strictEqual(facebookLink.props.className, "sources-nav__item active");
        assert.strictEqual(facebookLink.props.children[1], "Facebook"); //eslint-disable-line no-magic-numbers
    });

    it("should have /configure/twitter link for twitter", () => {
        const configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "facebook": true, "twitter": true }} />);
        const [, , twitterLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(twitterLink.props.to, "/configure/twitter");
        assert.strictEqual(twitterLink.props.className, "sources-nav__item active");
        assert.strictEqual(twitterLink.props.children[1], "Twitter"); //eslint-disable-line no-magic-numbers
    });

    it("should have a next button with facebook link if current source is web", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="web" />);
        const nextLink = wrapper.find(".sources-nav__next");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.to, "/configure/facebook");
        assert.strictEqual(nextLink.node.props.children[1], " Next"); //eslint-disable-line no-magic-numbers

        const icon = nextLink.node.props.children[0]; //eslint-disable-line no-magic-numbers
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right");
    });

    it("should have a next button with twitter link if current source is facebook and user has logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": true }} />);
        const nextLink = wrapper.find(".sources-nav__next");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.to, "/configure/twitter");
        assert.strictEqual(nextLink.node.props.children[1], " Next"); //eslint-disable-line no-magic-numbers

        const icon = nextLink.node.props.children[0]; //eslint-disable-line no-magic-numbers
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right");
    });

    it("should have a skip button with twitter link if current source is facebook and user has not logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": false }} />);
        const skipLink = wrapper.find(".sources-nav__skip");
        assert.strictEqual(skipLink.node.type.displayName, "Link");
        assert.strictEqual(skipLink.node.props.to, "/configure/twitter");
        assert.strictEqual(skipLink.node.props.children, "Skip"); //eslint-disable-line no-magic-numbers
    });

    it("should have a sign in button if current source is facebook and user has not logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        assert.strictEqual(signInBtn.node.type, "button");

        const [icon, text] = signInBtn.node.props.children;
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right");
        assert.strictEqual(text, " Sign in");
    });

    it("should open fbLogin after clicking on signin", () => {
        const fbLogin = sandbox.spy();
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" fbLogin={fbLogin} sourcesAuthenticationInfo={{ "facebook": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        signInBtn.simulate("click");
        assert.isTrue(fbLogin.called);
    });

    it("should have a done button if current source is twitter and user has logged into twitter", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "twitter": true }} />);
        const nextLink = wrapper.find(".sources-nav__next");
        assert.strictEqual(nextLink.node.type, "button");
        assert.strictEqual(nextLink.node.props.children[1], " Done"); //eslint-disable-line no-magic-numbers

        const icon = nextLink.node.props.children[0]; //eslint-disable-line no-magic-numbers
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-check");
    });

    it("should have a skip button link if current source is twitter and user has not logged into twitter", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "twitter": false }} />);
        const skipLink = wrapper.find(".sources-nav__skip");
        assert.strictEqual(skipLink.node.type, "button");
        assert.strictEqual(skipLink.node.props.children, "Skip"); //eslint-disable-line no-magic-numbers
    });

    it("should have a sign in button if current source is twitter and user has not logged into twiiter", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "twitter": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        assert.strictEqual(signInBtn.node.type, "button");

        const [icon, text] = signInBtn.node.props.children;
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right");
        assert.strictEqual(text, " Sign in");
    });

    it("should open twitterLogin after clicking on signin", () => {
        const twitterLogin = sandbox.spy();
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" twitterLogin={twitterLogin} sourcesAuthenticationInfo={{ "twitter": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        signInBtn.simulate("click");
        assert.isTrue(twitterLogin.called);
    });
});
