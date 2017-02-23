import SourceFilters from "../../../src/js/newsboard/filter/SourceFilters";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";

describe("SourceFilters", () => {

    it("should call renderSources with current sourceType and searchKey", () => {
        let sourceFilter = TestUtils.createRenderer();
        let renderSourceFun = (sourceType, searchKey) => {
            assert.strictEqual(sourceType, "twitter");
            assert.strictEqual(searchKey, "the");
        };
        sourceFilter.render(<SourceFilters currentTab={"twitter"} searchKeyword={"the"} renderSources={renderSourceFun} />);
    });
});
