import { FacebookTabs } from "../../../src/js/config/components/FacebookTabs";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import sinon from "sinon";

describe("Facebook Tabs", () => {
    let nav = null, store = null;

    beforeEach("Facebook Tabs", () => {
        store = { "getState": () => {
            return {
                "facebookCurrentSourceTab": "Profiles"
            };
        } };

        let renderer = TestUtils.createRenderer();
        nav = renderer.render(<FacebookTabs dispatch={() => {}} store={store} currentTab="Profiles"/>);
    });

    it("should have nav tabs to switch between facebook sources", () => {
        expect(nav.type).to.equal("nav");

        let tabLinks = nav.props.children;
        expect(tabLinks).to.have.lengthOf(3); //eslint-disable-line no-magic-numbers

        let [firstTab, secondTab, thirdTab] = tabLinks;
        expect(firstTab.props.children).to.equal("Profiles");
        expect(secondTab.props.children).to.equal("Pages");
        expect(thirdTab.props.children).to.equal("Groups");
    });

    it("Profiles link should be highlighted by default", () => {
        let [firstTab] = nav.props.children;
        expect(firstTab.props.className).to.have.string("active");
    });

    /* TODO: should mock the getSourcesOf method which is getting called inside dispatch*/ //eslint-disable-line
    xit("should dispacth on clicking it", () => {
        let dispatch = sinon.spy();
        nav = TestUtils.renderIntoDocument(<FacebookTabs dispatch={dispatch} store currentTab="Profiles"/>);
        let [, secondTab] = TestUtils.scryRenderedDOMComponentsWithClass(nav, "fb-sources-tab__item");
        TestUtils.Simulate.click(secondTab);
        expect(dispatch.calledOnce).to.be.ok; //eslint-disable-line no-unused-expressions
    });
});
