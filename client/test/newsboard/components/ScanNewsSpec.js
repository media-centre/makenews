import ScanNews from "./../../../src/js/newsboard/components/ScanNews";
import DisplayFeeds from "./../../../src/js/newsboard/components/DisplayFeeds";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { expect } from "chai";

xdescribe("Scan News", () => {
    let result = null; //eslint-disable-line no-unused-vars

    beforeEach("Scan News", () => {
        const dispatch = () => {};
        const store = {
            "getState": ()=>{}
        };
        const renderer = TestUtils.createRenderer();
        // eslint-disable-next-line react/jsx-no-bind
        renderer.render(<ScanNews store = {store} dispatch={dispatch} />);
        result = renderer.getRenderOutput();
    });

    it("should have DisplayFeeds Component", () => {
        const renderedSources = findAllWithType(result, DisplayFeeds);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });
});
