import { ConfigureURLs } from "./../../../src/js/config/components/ConfigureURLs";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { Link } from "react-router";
import { assert } from "chai";

describe("ConfigureURLs", () => {
    it("should have a nav with class sources-nav", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(
            <ConfigureURLs dispatch = {() => {}} store params = {{ "sourceType": "web" }} children />);
        let result = renderer.getRenderOutput();

        let [nav] = result.props.children;
        assert.equal(nav.type, "nav");
        assert.equal(nav.props.className, "sources-nav");
    });

    it("should have /configure/web link for web", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigureURLs dispatch = {() => {}} store params = {{ "sourceType": "web" }} children />);
        let [webLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(webLink.props.to, "/configure/web");
        assert.strictEqual(webLink.props.className, "sources-nav__item active");
    });

    it("should have /configure/facebook/profiles link for facebook", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigureURLs dispatch = {() => {}} store params = {{ "sourceType": "facebook" }} children />);
        let [, facebookLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(facebookLink.props.to, "/configure/facebook/profiles");
        assert.strictEqual(facebookLink.props.className, "sources-nav__item active");
    });

    it("should have /configure/twitter link for twitter", () => {
        let configureUrl = TestUtils.renderIntoDocument(
            <ConfigureURLs dispatch = {() => {}} store params = {{ "sourceType": "twitter" }} children />);
        let [, , twitterLink] = TestUtils.scryRenderedComponentsWithType(configureUrl, Link);
        assert.strictEqual(twitterLink.props.to, "/configure/twitter");
        assert.strictEqual(twitterLink.props.className, "sources-nav__item active");
    });
});
