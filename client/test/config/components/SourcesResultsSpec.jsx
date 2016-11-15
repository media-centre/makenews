import SourcesResults from "../../../src/js/config/components/SourcesResults"; 
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("Source Results", () => {
    let sources = null, sourceResults = null, renderedDOM = null;

    beforeEach("Source Results", () => {
        sources = [
            { "name": "Profile 1" }
        ];
        sourceResults = TestUtils.renderIntoDocument(<SourcesResults sources={sources} />);
        renderedDOM = ReactDOM.findDOMNode(sourceResults);
    });

    it("should have add all button", () => {
        let button = renderedDOM.querySelectorAll("button");
        expect(button.length).to.equal(1); //eslint-disable-line no-magic-numbers
        expect(button[0].textContent).to.equal(" Add All "); //eslint-disable-line no-magic-numbers
    });

    it("should render the source URLs", () => {
        let renderedSources = renderedDOM.querySelectorAll(".source");
        expect(renderedSources.length).to.equal(sources.length);
    });
});
