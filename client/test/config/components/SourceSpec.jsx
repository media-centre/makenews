import Source from "../../../src/js/config/components/Source";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("Source URL component", () => {
    it("should have url name", () => {
        let source = {
            "name": "Source Url"
        };
        let sourceRendered = TestUtils.renderIntoDocument(<Source source={source} />);
        let sourceDOM = ReactDOM.findDOMNode(sourceRendered);
        expect(sourceDOM.textContent).to.equal("Source Url");
    });
});
