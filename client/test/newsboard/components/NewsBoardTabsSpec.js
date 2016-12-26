import NewsBoardTabs from "./../../../src/js/newsboard/components/NewsBoardTabs";
import NewsBoardTab from "./../../../src/js/newsboard/components/NewsBoardTab";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { expect } from "chai";

describe("NewsBoardTabs", () => {
    let result = null;
    beforeEach("NewsBoardTabs", () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<NewsBoardTabs />);
        result = renderer.getRenderOutput();
    });

    it("should have tabs to switch between sources", () => {
        let renderedSources = findAllWithType(result, NewsBoardTab);
        expect(renderedSources).to.have.lengthOf(4);  //eslint-disable-line no-magic-numbers
    });

    it("should have classname", () => {
        expect(result.type).to.be.equals("div");
        expect(result.props.className).to.be.equals("source-type-bar");
    });
});
