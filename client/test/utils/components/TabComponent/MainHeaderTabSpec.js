/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import MainHeaderTab from "../../../../src/js/utils/components/TabComponent/MainHeaderTab.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../../helper/TestHelper.js";

describe("MainHeaderTab", () => {
    let highlightedTab = null, mainHeaderTab = null;

    before("MainHeaderTab", () => {
        highlightedTab = {
            "tabName": "Park"
        };
    });

    it("should have link to url", () => {
        mainHeaderTab = TestUtils.renderIntoDocument(
            <MainHeaderTab name="Park" url="/park" tabToHighlight={highlightedTab} className="park"/>
        );
        let linkElement = TestUtils.scryRenderedComponentsWithType(mainHeaderTab, Link);
        let linkProps = linkElement[0].props;
        assert.strictEqual("/park", linkProps.to);
        assert.strictEqual("selected", linkProps.className);
        assert.strictEqual("Park", linkProps.children[1].props.children);
        assert.strictEqual("park header-link-image", linkProps.children[0].props.className);
    });

    it("should not add selected class name from park", () => {
        mainHeaderTab = TestUtils.renderIntoDocument(
            <MainHeaderTab name="Surf" url="/surf" tabToHighlight={highlightedTab} className="surf"/>
        );
        let linkElement = TestUtils.scryRenderedComponentsWithType(mainHeaderTab, Link);
        assert.strictEqual("", linkElement[0].props.className);
    });
});
