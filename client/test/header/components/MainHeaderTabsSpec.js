import { MainHeaderTabs } from "../../../src/js/header/components/MainHeaderTabs";
import React from "react";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";

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
        expect(div.props.children.length).to.equal(2); //eslint-disable-line no-magic-numbers
        expect(div.type).to.equal("div");
    });

    it(" should have nav tabs in left side of header", () => {
        let firstNav = div.props.children[0]; //eslint-disable-line no-magic-numbers

        let leftSideHeaders = firstNav.props.children;
        let [firstTab, secondTab] = leftSideHeaders;

        expect(firstNav.type).to.equal("nav");
        expect(firstTab.props.children.props.children).to.equal("Scan News");
        expect(secondTab.props.children.props.children).to.equal("Write a Story");
    });

    it(" should have nav tabs in Right side of header", () => {
        let secondNav = div.props.children[1]; //eslint-disable-line no-magic-numbers

        let rightSideHeaders = secondNav.props.children;
        let [firstTab, secondTab] = rightSideHeaders;

        let userProfileTab = secondTab.props.children;
        let [ image, name, arrow ] = userProfileTab;

        expect(secondNav.type).to.equal("nav");
        expect(firstTab.props.children.props.className).to.equal("main-header-right-sources__configure__image");
        expect(image.props.className).to.equal("main-header-right-sources__userprofile__image");
        expect(name.props.className).to.equal("main-header-right-sources__userprofile__name");
        expect(arrow.props.className).to.equal("main-header-right-sources__userprofile__down");
    });
});
