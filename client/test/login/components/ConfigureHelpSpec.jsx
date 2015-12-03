/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import ConfigureHelp from "../../../src/js/login/components/ConfigureHelp.jsx";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";

describe("ConfigureHelp", () => {
    let configureComponent = null;

    before("ConfigureHelp", () => {
        let configureHelp = {
            "name": "Test Configure Name",
            "text": "sample Configure text"
        };
        configureComponent = TestUtils.renderIntoDocument(
            <ConfigureHelp configureHelp={configureHelp}/>
        );
    });

    it("should have Configure help name ", () => {
        let nameDOM = ReactDOM.findDOMNode(configureComponent.refs.name);
        assert.strictEqual("Test Configure Name", nameDOM.innerHTML);
    });

    it("should have Configure help text ", () => {
        let textDOM = ReactDOM.findDOMNode(configureComponent.refs.text);
        assert.strictEqual("sample Configure text", textDOM.innerHTML);
    });

    it("should have configure image", () => {
        let imageDOM = ReactDOM.findDOMNode(configureComponent.refs.image);
        assert.isNotNull(imageDOM);
    });

});

