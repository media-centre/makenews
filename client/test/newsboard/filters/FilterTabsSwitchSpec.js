import FilterTabs from "../../../src/js/newsboard/filter/FilterTabs";
import FilterTab from "../../../src/js/newsboard/filter/FilterTab";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType, findAllWithClass } from "react-shallow-testutils";
import { assert } from "chai";

describe("FilterTabsSwitch", () => {

    it("should have source-type-bar class", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<FilterTabs currentTab={"twitter"} />);
        let filterTabDOM = renderer.getRenderOutput();

        assert.strictEqual(findAllWithClass(filterTabDOM, "source-type-bar").length, 1); //eslint-disable-line no-magic-numbers
    });

    it("should have only one FilterTab element except for trending", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<FilterTabs currentTab={"twitter"} />);
        let filterTabDOM = renderer.getRenderOutput();
        assert.strictEqual(findAllWithType(filterTabDOM, FilterTab).length, 1); //eslint-disable-line no-magic-numbers
    });

    it("should have three FilterTab elements for trending", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<FilterTabs currentTab={"trending"} />);
        let filterTabDOM = renderer.getRenderOutput();
        assert.strictEqual(findAllWithType(filterTabDOM, FilterTab).length, 3); //eslint-disable-line no-magic-numbers
    });
});
