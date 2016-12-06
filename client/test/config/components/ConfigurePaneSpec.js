import React from "react";
import { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SourcePane from "../../../src/js/config/components/SourcePane";
import { findAllWithType, findWithClass } from "react-shallow-testutils";

describe("Configure Pane", () => {
    let store = null, renderer = null, configurePaneDOM = null, dispatch = null;
    let currentTab = null;

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
        currentTab = "Profiles";
        renderer = TestUtils.createRenderer();
        configurePaneDOM = renderer.render(<ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab} />);
    });

    it("wraps with a <div> with a proper class name", function() {
        expect(configurePaneDOM.type).to.equal("div");
        expect(configurePaneDOM.props.className).to.equal("configure-sources");
    });

    it("should have an input box for searching sources", () => {
        let result = renderer.getRenderOutput();
        let inputBox = findWithClass(result, "search-sources");

        expect(inputBox.type).to.equal("input");
        expect(inputBox.ref).to.equal("searchSources");
        expect(inputBox.props.type).to.equal("text");
        expect(inputBox.props.placeholder).to.equal(`Search ${currentTab}....`);
    });

    it("should have an addon search icon", () => {
        let result = renderer.getRenderOutput();
        let addon = findWithClass(result, "input-group__addon");
        expect(addon.type).to.equal("span");

        let img = addon.props.children;
        expect(img.props.src).to.equal("./images/search-icon.png");
    });

    it("should have SourcePane", () => {
        let result = renderer.getRenderOutput();
        let renderedSources = findAllWithType(result, SourcePane);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        expect(renderedSources[0].props.dispatch).to.deep.equal(dispatch); //eslint-disable-line no-magic-numbers
    });


    /* TODO: write these four test */ //eslint-disable-line
    xdescribe("search input box", () => {
        it("should not dispatch til the enter key is pressed", () => {

        });

        it("should not dispatch if the current tab is profiles", () => {

        });

        it("should not dispatch if there is no value in input box", () => {

        });

        it("should dispatch the getSources", () => {

        });
    });
});
