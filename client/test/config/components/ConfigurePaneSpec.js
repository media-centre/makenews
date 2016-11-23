import React from "react";
import { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SourcesResults from "../../../src/js/config/components/SourcesResults";
import { findAllWithType } from "react-shallow-testutils";

describe("Configure Pane", () => {
    let store = null, renderer = null, configurePaneDOM = null;

    beforeEach("Configure Pane", () => {
        store = {
            "getState": ()=>{
                return { "state": {
                    "facebookProfiles": []
                }
                };
            }
        };
        renderer = TestUtils.createRenderer();
        configurePaneDOM = renderer.render(<ConfigurePane dispatch={()=>{}} store={store} sources={["something"]} />);
    });

    it("wraps with a <div> with a proper class name", function() {
        expect(configurePaneDOM.type).to.equal("div");
        expect(configurePaneDOM.props.className).to.equal("configure-sources");
    });

    it("should have an input box for searching sources", () => {
        expect(configurePaneDOM.props.children).to.contain(<input type="text" ref="searchSources" className="search-sources" placeholder="Search...." />);
    });

    it("should have Sources results component with the given sources", () => {
        let result = renderer.getRenderOutput();
        let renderedSources = findAllWithType(result, SourcesResults);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        expect(renderedSources[0].props.sources).to.deep.equal(["something"]); //eslint-disable-line no-magic-numbers
    });
});
