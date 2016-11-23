/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import ParkHelp from "../../../src/js/login/components/ParkHelp";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper";

describe("ParkHelp", () => {
    let parkHelpComponent = null;

    before("ParkHelp", () => {
        let parkHelp = {
            "name": "Test Park Name",
            "text": "sample Park text"
        };
        parkHelpComponent = TestUtils.renderIntoDocument(
            <ParkHelp parkHelp={parkHelp}/>
        );
    });

    it("should have Park help name ", () => {
        let nameDOM = ReactDOM.findDOMNode(parkHelpComponent.refs.name);
        assert.strictEqual("Test Park Name", nameDOM.innerHTML);
    });

    it("should have Park help text ", () => {
        let textDOM = ReactDOM.findDOMNode(parkHelpComponent.refs.text);
        assert.strictEqual("sample Park text", textDOM.innerHTML);
    });

    it("should have Park image", () => {
        let imageDOM = ReactDOM.findDOMNode(parkHelpComponent.refs.image);
        assert.isNotNull(imageDOM);
    });

});

