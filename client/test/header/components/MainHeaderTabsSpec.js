/*eslint no-magic-numbers:0*/
import { MainHeaderTabs } from "../../../src/js/header/components/MainHeaderTabs";
import UserProfile from "../../../src/js/header/components/UserProfile";
import React from "react";
import ReactDOM from "react-dom";
import { expect, assert } from "chai";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";

describe("MainHeaderTabs", () => {
    let store = null, div = null;

    beforeEach("MainHeaderTabs", () => {
        store = { "getState": () => {
            return {
                "currentHeaderTab": "SCAN_NEWS"
            };
        } };

        let renderer = TestUtils.createRenderer();
        div = renderer.render(<MainHeaderTabs dispatch={() => {}} store={store} currentHeaderTab="SCAN_NEWS"/>);
    });

    it("should have two nav tabs", () => {
        expect(div.props.children.length).to.equal(2);
        expect(div.type).to.equal("div");
    });

    it(" should have nav tabs in left side of header", () => {
        let firstNav = div.props.children[0];

        let leftSideHeaders = firstNav.props.children;
        let [firstTab, secondTab] = leftSideHeaders;

        expect(firstNav.type).to.equal("nav");
        expect(firstTab.props.children.props.children).to.equal("Scan News");
        expect(secondTab.props.children.props.children).to.equal("Write a Story");
    });

    it(" should have nav tabs in Right side of header", () => {
        let secondNav = div.props.children[1];

        let rightSideHeaders = secondNav.props.children;
        let [firstTab, secondTab] = rightSideHeaders;

        let userProfileTab = secondTab.props.children;
        let [image, name, arrow] = userProfileTab;

        expect(secondNav.type).to.equal("nav");
        expect(firstTab.props.children.props.className).to.equal("header-tabs__right__configure__image");
        expect(image.props.className).to.equal("header-tabs__right__userprofile__image");
        expect(name.props.className).to.equal("header-tabs__right__userprofile__name");
        expect(arrow.props.className).to.equal("header-tabs__right__userprofile__downarrow");
    });

    describe("UserProfile", () => {

        it("should have toggle option", () => {
            let userProfile = TestUtils.renderIntoDocument(<MainHeaderTabs />);
            let userProfileDom = ReactDOM.findDOMNode(userProfile);
            TestUtils.Simulate.click(userProfileDom.querySelector(".header-tabs__right__userprofile"));
            assert.isTrue(userProfile.state.show);
            TestUtils.Simulate.click(userProfileDom.querySelector(".header-tabs__right__userprofile"));
            assert.isFalse(userProfile.state.show);
        });

        it("should have main header tabs component", () => {
            let renderer = TestUtils.createRenderer();
            renderer.render(<MainHeaderTabs />);
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, UserProfile);
            expect(renderedSources).to.have.lengthOf(1);
        });
    });
});
