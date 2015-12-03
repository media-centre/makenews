/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import Branding from "../../../src/js/login/components/Branding.jsx";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";

describe("Branding Component", () => {
    let branding = null, brandingComponent = null;

    before("Branding Component", () => {
        branding = {
            "text": "sample branding text"
        };
        brandingComponent = TestUtils.renderIntoDocument(
            <Branding branding={branding}/>
        );
    });

    it("should have branding text ", () => {
        let brandingElementDOM = ReactDOM.findDOMNode(brandingComponent.refs.branding);
        assert.strictEqual(branding.text, brandingElementDOM.innerHTML);
    });
});
