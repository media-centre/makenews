import ScanNews from "./../../../src/js/newsboard/components/ScanNews";
import DisplayFeeds from "./../../../src/js/newsboard/components/DisplayFeeds";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { expect } from "chai";

xdescribe("Scan News", () => {
    let scanNews = null, result = null; //eslint-disable-line no-unused-vars

    beforeEach("Scan News", () => {
        let dispatch = () => {};
        let store = {
            "getState": ()=>{}
        };
        let renderer = TestUtils.createRenderer();
        scanNews = renderer.render(<ScanNews store = {store} dispatch={dispatch} />);
        result = renderer.getRenderOutput();
    });

    it("should have DisplayFeeds Component", () => {
        let renderedSources = findAllWithType(result, DisplayFeeds);
        expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
    });
});
