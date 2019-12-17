/*eslint react/jsx-no-bind:0*/

import Source from "../../../src/js/config/components/Source";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";

describe("Source URL component", () => {
    let source = null;
    let sourceRendered = null;
    let sourceDOM = null;
    const dispatchFun = () => {};

    before("Source URL component", () => {
        source = {
            "name": "Source Url",
            "picture": {
                "data": {
                    "url": "https://facebook.com/user.png"
                }
            },
            "url": "http://some.url"
        };
        sourceRendered = TestUtils.renderIntoDocument(
            <Source source={source} dispatch={dispatchFun} currentSourceType="Profiles" />
        );
        sourceDOM = ReactDOM.findDOMNode(sourceRendered);
    });

    it("should have source name", () => {
        expect(sourceDOM.textContent).to.equal("Source Url");
    });

    it("should not have source url if currentSourceType is not WEB", () => {
        const sourceUrl = sourceDOM.querySelectorAll(".source__url");
        expect(sourceUrl).to.have.lengthOf(0); // eslint-disable-line no-magic-numbers
    });

    it("should have source url if currentSourceType is WEB", () => {
        sourceRendered = TestUtils.renderIntoDocument(
            <Source source={source} dispatch={dispatchFun} currentSourceType="web" />
        );
        sourceDOM = ReactDOM.findDOMNode(sourceRendered);

        const sourceUrl = sourceDOM.querySelectorAll(".source__url");
        expect(sourceUrl).to.have.lengthOf(1); // eslint-disable-line no-magic-numbers
    });

    it("should have user icon with the give source", () => {
        const [image] = sourceDOM.querySelectorAll("img");
        expect(image.src).to.equal(source.picture.data.url);
    });

    it("should have add button in the source when it's not added to configured list", () =>{
        const imageSrc = sourceDOM.querySelectorAll(".source__action-icon img")[0].src; //eslint-disable-line no-magic-numbers
        expect(imageSrc).to.equal("./images/add-btn.png");
    });

    it("should have success arrow icon in the source when it's added to configured list", () =>{
        source.added = true;
        sourceRendered = TestUtils.renderIntoDocument(
            <Source source={source} dispatch={dispatchFun} currentSourceType="Profiles" />
        );
        sourceDOM = ReactDOM.findDOMNode(sourceRendered);
        const imageSrc = sourceDOM.querySelectorAll(".source__action-icon img")[0].src; //eslint-disable-line no-magic-numbers
        expect(imageSrc).to.equal("./images/success-arrow.png");
    });
});
