import Source from "../../../src/js/config/components/Source";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("Source URL component", () => {
    let source = null;

    before("Source URL component", () => {
        source = {
            "name": "Source Url",
            "picture": {
                "data": {
                    "url": "https://facebook.com/user.png"
                }
            }
        };
    });

    it("should have url name", () => {
        let sourceRendered = TestUtils.renderIntoDocument(<Source source={source} />);
        let sourceDOM = ReactDOM.findDOMNode(sourceRendered);
        expect(sourceDOM.textContent).to.equal("Source Url");
    });
    
    it("should have user icon with the give source", () => {
        let sourceRendered = TestUtils.renderIntoDocument(<Source source={source} />);
        let renderedDOM = ReactDOM.findDOMNode(sourceRendered);
        let imageSrc = renderedDOM.querySelectorAll("img")[0].src; //eslint-disable-line no-magic-numbers
        expect(imageSrc).to.equal(source.picture.data.url);
    });
});
