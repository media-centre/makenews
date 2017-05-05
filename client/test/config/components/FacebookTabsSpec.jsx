import { FacebookTabs } from "../../../src/js/config/components/FacebookTabs";
import React from "react";
import { Router, Route, Link } from "react-router";
import History from "./../../../src/js/History";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import sinon from "sinon";
import { PROFILES } from "./../../../src/js/config/actions/FacebookConfigureActions";
import * as sourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";

describe("Facebook Tabs", () => {
    let nav = null, store = null;
    const dispatchFun = () => {};
    const facebookComponent = () => <FacebookTabs dispatch={dispatchFun} store={store} currentTab={PROFILES}/>;

    beforeEach("Facebook Tabs", () => {
        store = { "getState": () => {
            return {
                "facebookCurrentSourceTab": "profiles"
            };
        } };

        let renderer = TestUtils.createRenderer();
        nav = renderer.render(<FacebookTabs dispatch={dispatchFun} store={store} currentTab="pages"/>);
    });

    it("should have nav tabs to switch between facebook sources", () => {
        expect(nav.type).to.equal("nav");

        let tabLinks = nav.props.children;
        expect(tabLinks).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
        let [firstTab, secondTab] = tabLinks;
        expect(firstTab.props.children).to.equal("Pages");
        expect(secondTab.props.children).to.equal("Groups");
    });

    it("Pages link should be highlighted by default", () => {
        let [firstTab] = nav.props.children;
        expect(firstTab.props.className).to.have.string("active");
    });

    it("should have proper links to profiles, pages, groups", () => {
        nav = TestUtils.renderIntoDocument(
            <Router history={History.getHistory()}>
                <Route path="/" component = {facebookComponent} />
            </Router>
        );
        let [pages, groups] = TestUtils.scryRenderedComponentsWithType(nav, Link);
        expect(pages.props.to).to.equal("/configure/facebook/pages");
        expect(groups.props.to).to.equal("/configure/facebook/groups");
    });

    it("should dispatch facebookSourceTabSwitch on clicking Pages tab", () => {
        let sandbox = sinon.sandbox.create();
        let fbSourceTabSwitch = sandbox.mock(sourceConfigActions).expects("switchSourceTab").withArgs("pages");
        nav = TestUtils.renderIntoDocument(
            <Router history={History.getHistory()}>
                <Route path="/" component = {facebookComponent} />
            </Router>
        );
        let [pagesLink] = TestUtils.scryRenderedDOMComponentsWithClass(nav, "fb-sources-tab__item");
        TestUtils.Simulate.click(pagesLink, { "target": { "dataset": { "tab": "pages" } } });
        fbSourceTabSwitch.verify();
        sandbox.restore();
    });

    it("should dispatch facebookSourceTabSwitch on clicking groups tab", () => {
        let sandbox = sinon.sandbox.create();
        let fbSourceTabSwitch = sandbox.mock(sourceConfigActions).expects("switchSourceTab").withArgs("groups");
        nav = TestUtils.renderIntoDocument(
            <Router history={History.getHistory()}>
                <Route path="/" component = {facebookComponent} />
            </Router>
        );
        let [, groupsTab] = TestUtils.scryRenderedDOMComponentsWithClass(nav, "fb-sources-tab__item");
        TestUtils.Simulate.click(groupsTab, { "target": { "dataset": { "tab": "groups" } } });
        fbSourceTabSwitch.verify();
        sandbox.restore();
    });
});
