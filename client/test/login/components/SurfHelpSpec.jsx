/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import SurfHelp from "../../../src/js/login/components/SurfHelp";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper";

describe("SurfHelp", () => {
    let surfHelpComponent = null;

    before("SurfHelp", () => {
        let surfHelp = {
            "name": "Test Surf Name",
            "text": "sample Surf text"
        };
        surfHelpComponent = TestUtils.renderIntoDocument(
            <SurfHelp surfHelp={surfHelp}/>
        );
    });

    it("should have Surf help name ", () => {
        let nameDOM = ReactDOM.findDOMNode(surfHelpComponent.refs.name);
        assert.strictEqual("Test Surf Name", nameDOM.innerHTML);
    });

    it("should have Surf help text ", () => {
        let textDOM = ReactDOM.findDOMNode(surfHelpComponent.refs.text);
        assert.strictEqual("sample Surf text", textDOM.innerHTML);
    });

    it("should have Surf image", () => {
        let imageDOM = ReactDOM.findDOMNode(surfHelpComponent.refs.image);
        assert.isNotNull(imageDOM);
    });

});

