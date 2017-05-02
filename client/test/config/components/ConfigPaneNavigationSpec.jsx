import React from "react";
import { ConfigPaneNavigation } from "./../../../src/js/config/components/ConfigPaneNavigation";
import { Link } from "react-router";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";
import { shallow } from "enzyme";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("ConfigPaneNavigation", () => {
    const sandbox = sinon.sandbox.create();
    const configurePage = {
        "header": {
            "mySources": "My Sources",
            "web": "Web URLs",
            "facebook": {
                "name": "Facebook",
                "tabs": {
                    "pages": "",
                    "groups": ""
                }
            },
            "twitter": "Twitter",
            "next": "Next",
            "done": "Done",
            "signIn": "Sign in"
        }
    };
    beforeEach("ConfigPaneNavigation", () => {
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });
    });

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
        const [, text] = webLink.props.children;
        assert.strictEqual(text, "Web URLs");
    });

    it("should have /configure/facebook/pages link for facebook", () => {
        const configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": true, "twitter": false }} />);
        const [, facebookLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(facebookLink.props.to, "/configure/facebook/pages");
        assert.strictEqual(facebookLink.props.className, "sources-nav__item active");
        const [, text] = facebookLink.props.children;
        assert.strictEqual(text, "Facebook");
    });

    it("should have /configure/twitter link for twitter", () => {
        const configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "facebook": true, "twitter": true }} />);
        const [, , twitterLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(twitterLink.props.to, "/configure/twitter");
        assert.strictEqual(twitterLink.props.className, "sources-nav__item active");
        const [, text] = twitterLink.props.children;
        assert.strictEqual(text, "Twitter");
    });

    it("should have a next button with facebook link if current source is web", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="web" />);
        const nextLink = wrapper.find(".sources-nav__next");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.className, "sources-nav__next btn btn-secondary");
        assert.strictEqual(nextLink.node.props.to, "/configure/facebook/pages");

        const [icon, , text] = nextLink.node.props.children;
        assert.strictEqual(text, "Next");
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right right-arrow");
    });

    it("should have a Done button with newsBoard link if current source is web and there are configured Sources", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="web" configuredSources={{ "web": [{ "_id": "url", "name": "title" }] }}/>);
        const nextLink = wrapper.find(".sources-nav__next.btn-primary");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.to, "/newsBoard");
        assert.strictEqual(nextLink.node.props.className, "sources-nav__next btn btn-primary");
        const [icon, , text] = nextLink.node.props.children;
        assert.strictEqual(text, "Done");
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-check check-icon");
    });

    it("should have a next button with twitter link if current source is facebook and user has logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": true }} />);
        const nextLink = wrapper.find(".sources-nav__next");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.to, "/configure/twitter");
        assert.strictEqual(nextLink.node.props.className, "sources-nav__next btn btn-secondary");
        const [icon, , text] = nextLink.node.props.children;
        assert.strictEqual(text, "Next");
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right right-arrow");
    });

    it("should have a Done button with newsBoard link if current source is facebook and user has logged into facebook and if there are any configured sources", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": true }} configuredSources={{ "web": [{ "_id": "url", "name": "title" }] }}/>);
        const nextLink = wrapper.find(".sources-nav__next.btn-primary");
        assert.strictEqual(nextLink.node.type.displayName, "Link");
        assert.strictEqual(nextLink.node.props.to, "/newsBoard");
        assert.strictEqual(nextLink.node.props.className, "sources-nav__next btn btn-primary");
        const [icon, , text] = nextLink.node.props.children;
        assert.strictEqual(text, "Done");
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-check check-icon");
    });

    it("should have a skip button with twitter link if current source is facebook and user has not logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": false }} />);
        const skipLink = wrapper.find(".sources-nav__skip");
        assert.strictEqual(skipLink.node.type.displayName, "Link");
        assert.strictEqual(skipLink.node.props.to, "/configure/twitter");
        assert.strictEqual(skipLink.node.props.className, "sources-nav__skip btn btn-secondary");
        assert.strictEqual(skipLink.node.props.children, "Skip");
    });

    it("should have a sign in button if current source is facebook and user has not logged into facebook", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="facebook" sourcesAuthenticationInfo={{ "facebook": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        assert.strictEqual(signInBtn.node.type, "button");

        const [icon,, text] = signInBtn.node.props.children;
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right right-arrow");
        assert.strictEqual(text, "Sign in");
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
        const [icon, , text] = nextLink.node.props.children;
        assert.strictEqual(text, "Done");
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-check check-icon");
    });

    it("should have a skip button link if current source is twitter and user has not logged into twitter", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "twitter": false }} />);
        const skipLink = wrapper.find(".sources-nav__skip");
        assert.strictEqual(skipLink.node.type, "button");
        assert.strictEqual(skipLink.node.props.children, "Skip");
    });

    it("should have a sign in button if current source is twitter and user has not logged into twiiter", () => {
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" sourcesAuthenticationInfo={{ "twitter": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        assert.strictEqual(signInBtn.node.type, "button");

        const [icon,, text] = signInBtn.node.props.children;
        assert.strictEqual(icon.type, "i");
        assert.strictEqual(icon.props.className, "fa fa-arrow-right right-arrow");
        assert.strictEqual(text, "Sign in");
    });

    it("should open twitterLogin after clicking on signin", () => {
        const twitterLogin = sandbox.spy();
        const wrapper = shallow(<ConfigPaneNavigation currentSourceType="twitter" twitterLogin={twitterLogin} sourcesAuthenticationInfo={{ "twitter": false }} />);
        const signInBtn = wrapper.find(".sources-nav__next");
        signInBtn.simulate("click");
        assert.isTrue(twitterLogin.called);
    });
});
