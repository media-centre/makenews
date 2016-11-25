import { Sources } from "../../../src/js/config/components/Sources";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Source from "../../../src/js/config/components/Source";
import { findAllWithType } from "react-shallow-testutils";

describe("SourcePane", () => {
    let sources = null;
    let result = null;

    beforeEach("SourcePane", () => {
        sources = [
            { "name": "Profile 1" },
            { "name": "Profile 2" }
        ];
        let renderer = TestUtils.createRenderer();
        renderer.render(<Sources sources={sources} dispatch={()=>{}} currentTab="Profiles" />);
        result = renderer.getRenderOutput();
    });

    it("should render Sources", () => {
        let renderedSources = findAllWithType(result, Source);
        expect(renderedSources).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
    });
});
