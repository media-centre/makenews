/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
import MainHeaderTab from "../../../../src/js/utils/components/TabComponent/MainHeaderTab.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../../helper/TestHelper";

describe("MainHeaderTab", () => {
    let highlightedTab = null, mainHeaderTab = null, parkCounter = 10;

    before("MainHeaderTab", () => {
        highlightedTab = {
            "tabNames": ["Park"]
        };
    });

    it("should have link to url", () => {
        mainHeaderTab = TestUtils.renderIntoDocument(
            <MainHeaderTab name="Park" url="/park" tabToHighlight={highlightedTab} className="park" parkCounter={parkCounter} id="1"/>
        );
        let linkElement = TestUtils.scryRenderedComponentsWithType(mainHeaderTab, Link);
        let linkProps = linkElement[0].props;  // eslint-disable-line no-magic-numbers
        assert.strictEqual("/park", linkProps.to);
        assert.strictEqual("selected", linkProps.className);
        assert.strictEqual("Park", linkProps.children[2].props.children); // eslint-disable-line no-magic-numbers
        assert.strictEqual("park header-link-image", linkProps.children[1].props.className); // eslint-disable-line no-magic-numbers
        let number = -1;
        assert.isTrue(linkProps.children[0].props.className.indexOf("counter") !== number); // eslint-disable-line no-magic-numbers
    });

    it("should not add selected class name from park", () => {
        mainHeaderTab = TestUtils.renderIntoDocument(
            <MainHeaderTab name="Surf" url="/surf" tabToHighlight={highlightedTab} className="surf" parkCounter={parkCounter} id="1"/>
        );
        let linkElement = TestUtils.scryRenderedComponentsWithType(mainHeaderTab, Link);
        assert.strictEqual("", linkElement[0].props.className); // eslint-disable-line no-magic-numbers
    });
});
