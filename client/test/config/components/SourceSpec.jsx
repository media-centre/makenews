import Source from "../../../src/js/config/components/Source";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe.only("Source URL component", () => {
    let source = null, sourceRendered = null, sourceDOM = null;

    before("Source URL component", () => {
        source = {
            "name": "Source Url",
            "picture": {
                "data": {
                    "url": "https://facebook.com/user.png"
                }
            }
        };
        sourceRendered = TestUtils.renderIntoDocument(<Source source={source} />);
        sourceDOM = ReactDOM.findDOMNode(sourceRendered);
    });

    it("should have url name", () => {
        expect(sourceDOM.textContent).to.equal("Source Url");
    });
    
    it("should have user icon with the give source", () => {
        let imageSrc = sourceDOM.querySelectorAll("img")[0].src; //eslint-disable-line no-magic-numbers
        expect(imageSrc).to.equal(source.picture.data.url);
    });

    it("should have add button in the source", () =>{
        let imageSrc = sourceDOM.querySelectorAll(".source__add-icon img")[0].src; //eslint-disable-line no-magic-numbers
        expect(imageSrc).to.equal("./images/add-btn.png");
    });
});
