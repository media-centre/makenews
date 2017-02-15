import React from "react";
import ConfigPaneNavigation from "./../../../src/js/config/components/ConfigPaneNavigation";
import { Link } from "react-router";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";

describe("ConfigPaneNavigation", () => {
    it("should have a nav with class sources-nav", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(
            <ConfigPaneNavigation currentSourceType="web" />);
        let nav = renderer.getRenderOutput();

        assert.equal(nav.type, "nav");
        assert.equal(nav.props.className, "sources-nav");
    });

    it("should have /configure/web link for web", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="web" />);
        let [webLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(webLink.props.to, "/configure/web");
        assert.strictEqual(webLink.props.className, "sources-nav__item active");
        assert.strictEqual(webLink.props.children[1], "Web URLs"); //eslint-disable-line no-magic-numbers
    });

    it("should have /configure/facebook/profiles link for facebook", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="facebook" />);
        let [, facebookLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(facebookLink.props.to, "/configure/facebook/profiles");
        assert.strictEqual(facebookLink.props.className, "sources-nav__item active");
        assert.strictEqual(facebookLink.props.children[1], "Facebook"); //eslint-disable-line no-magic-numbers
    });

    it("should have /configure/twitter link for twitter", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigPaneNavigation currentSourceType="twitter" />);
        let [, , twitterLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(twitterLink.props.to, "/configure/twitter");
        assert.strictEqual(twitterLink.props.className, "sources-nav__item active");
        assert.strictEqual(twitterLink.props.children[1], "Twitter"); //eslint-disable-line no-magic-numbers
    });
});
