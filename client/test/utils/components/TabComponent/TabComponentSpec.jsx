
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../../helper/TestHelper";
import TabComponent from "../../../../src/js/utils/components/TabComponent/TabComponent";
import mockStore from "../../../helper/ActionHelper";

describe("TabComponent with dispatch", () => {
    it("should highlight tab on click", (done) => {
        let highlightedTab = {
            "tabNames": ["Configure", "RSS"]
        };
        const expectedActions = [{ "type": "CHANGE_HIGHLIGHTED_TAB", "tabNames": ["Configure", "RSS"] }];
        const content = [];
        const store = mockStore({ "tabNames": ["Surf"] }, expectedActions, done);
        let dispatch = store.dispatch;
        let tabComponentElement = TestUtils.renderIntoDocument(
            <TabComponent tabToHighlight={highlightedTab} dispatch={dispatch}>
                <div tab-header="RSS" name="RSS" content={content}>
                    <div>{"this is tab 1 title"}</div>
                </div>
                <div tab-header="Facebook" name="Facebook" content="{content}">
                    <div>{"this is tab 2 title"}</div>
                </div>
            </TabComponent>
        );
        let tab = tabComponentElement.refs.tab0;
        TestUtils.Simulate.click(tab);
    });
});

describe("TabComponent", () => {
    let tabComponentElement = null, highlightedTab = null;

    before("TabComponent", () => {
        highlightedTab = {
            "tabNames": ["Configure", "RSS"]
        };
        const content = [];
        tabComponentElement = TestUtils.renderIntoDocument(
            <TabComponent tabToHighlight={highlightedTab} dispatch={()=>{}}>
                <div tab-header="RSS" name="RSS" content={content}>
                    <div>{"this is tab 1 title"}</div>
                </div>
                <div tab-header="Facebook" name="Facebook" content={content}>
                    <div>{"this is tab 2 title"}</div>
                </div>
            </TabComponent>
        );
    });

    it("should have tab titles mandatory", () => {
        assert.isDefined(tabComponentElement.props.children[0].props["tab-header"], "defined"); // eslint-disable-line no-magic-numbers
    });

    it("should have tab title as same as in the properties", () => {
        var tab = tabComponentElement.refs.tab0;
        assert.equal("RSS(0)", tab.textContent);
    });

    it("should select the first tab by default", ()=> {
        var tab = tabComponentElement.refs.tab0;
        assert.equal(true, tab.classList.contains("selected"));
    });

    it("should have minimum 2 tab contents", () => {
        assert.equal(2, tabComponentElement.props.children.length); // eslint-disable-line no-magic-numbers
    });

    it("should display content of selected by default", ()=> {
        assert.equal("this is tab 1 title", tabComponentElement.refs.tabContent.textContent);
    });

    it("should display content of selected tab by clicking tab header", ()=> {
        let tab = tabComponentElement.refs.tab1;
        TestUtils.Simulate.click(tab);
        assert.equal("this is tab 2 title", tabComponentElement.refs.tabContent.textContent);
    });

    it("should not change the content if we click on the tab which is already selected", () => {
        let tab = tabComponentElement.refs.tab0;
        TestUtils.Simulate.click(tab);
        assert.equal("this is tab 1 title", tabComponentElement.refs.tabContent.textContent);
    });

    it("child should have selected class for the rss tab", () => {
        let tab = tabComponentElement.refs.tab0;
        assert.equal(true, tab.classList.contains("selected"));
    });

    it("child should have selected class for the facebook tab", () => {
        let tab = tabComponentElement.refs.tab1;
        assert.equal(false, tab.classList.contains("selected"));
    });
});
