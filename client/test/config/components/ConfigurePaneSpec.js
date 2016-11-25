import React from "react";
import { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SourcePane from "../../../src/js/config/components/SourcePane";
import { findAllWithType } from "react-shallow-testutils";

describe("Configure Pane", () => {
    let store = null, renderer = null, configurePaneDOM = null, dispatch = null;

    beforeEach("Configure Pane", () => {
        dispatch = () => {};
        store = {
            "getState": ()=>{
                return { "state": {
                    "facebookCurrentSourceTab": []
                }
                };
            }
        };
        renderer = TestUtils.createRenderer();
        configurePaneDOM = renderer.render(<ConfigurePane dispatch={dispatch} store={store} currentTab="Profiles" />);
    });

    it("wraps with a <div> with a proper class name", function() {
        expect(configurePaneDOM.type).to.equal("div");
        expect(configurePaneDOM.props.className).to.equal("configure-sources");
    });

    it("should have an input box for searching sources", () => {
        expect(configurePaneDOM.props.children).to.contain(<input type="text" ref="searchSources" className="search-sources" placeholder="Search...." />);
    });

    it("should have SourcePane", () => {
        let result = renderer.getRenderOutput();
        let renderedSources = findAllWithType(result, SourcePane);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        expect(renderedSources[0].props.dispatch).to.deep.equal(dispatch); //eslint-disable-line no-magic-numbers
    });
});
