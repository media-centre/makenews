import SourcePane from "../../../src/js/config/components/SourcePane";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Sources from "../../../src/js/config/components/Sources";
import FacebookTabs from "../../../src/js/config/components/FacebookTabs";
import { findAllWithType } from "react-shallow-testutils";

describe("SourcePane", () => {
    let sources = null;
    let result = null;

    beforeEach("SourcePane", () => {
        sources = [
            { "name": "Profile 1" }
        ];
        let renderer = TestUtils.createRenderer();
        renderer.render(<SourcePane sources={sources} dispatch={()=>{}}/>);
        result = renderer.getRenderOutput();
    });

    it("should have facebook tabs component", () => {
        let renderedSources = findAllWithType(result, FacebookTabs);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });

    it("should have add all button", () => {
        let [, button] = result.props.children;
        expect(button.type).to.equal("button");
    });

    it("should have Sources", () => {
        let renderedSources = findAllWithType(result, Sources);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });
});
