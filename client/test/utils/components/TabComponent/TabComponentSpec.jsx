"use strict";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../../helper/TestHelper.js";
import TabComponent from "../../../../src/js/utils/components/TabComponent/TabComponent";

describe("TabComponent", () => {
    let TabComponentElement = null;

    before("TabComponent", () => {
        TabComponentElement = TestUtils.renderIntoDocument(
            <TabComponent>
                <div tab-header="tab 1">
                    <div>{"this is tab 1 title"}</div>
                </div>
                <div tab-header="tab 2">
                    <div>{"this is tab 2 title"}</div>
                </div>
            </TabComponent>
        );
    });

    it("should have tab titles mandatory", () => {
        assert.isDefined(TabComponentElement.props.children[0].props["tab-header"], "defined");
    });

    it("should have tab title as same as in the properties", () => {
        var tab = TabComponentElement.refs.tab0;
        assert.equal("tab 1", tab.textContent);
    });

    it("should select the first tab by default", ()=> {
        var tab = TabComponentElement.refs.tab0;
        assert.equal(true, tab.classList.contains("selected"));
    });

    it("should have minimum 2 tab contents", () => {
        assert.equal(2, TabComponentElement.props.children.length);
    });

    it("should display content of selected by default", ()=> {
        assert.equal("this is tab 1 title", TabComponentElement.refs.tabContent.textContent);
    });

    it("should display content of selected tab by clicking tab header", ()=> {
        var tab = TabComponentElement.refs.tab1;
        TestUtils.Simulate.click(tab);
        assert.equal("this is tab 2 title", TabComponentElement.refs.tabContent.textContent);
    });

    it("should not change the content if we click on the tab which is already selected", () => {
        var tab = TabComponentElement.refs.tab0;
        TestUtils.Simulate.click(tab);
        assert.equal("this is tab 1 title", TabComponentElement.refs.tabContent.textContent);
    });

});
