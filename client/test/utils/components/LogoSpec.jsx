/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import Logo from "../../../src/js/utils/components/Logo.jsx";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";

describe("Logo Component", () => {
    let logoComponent = null;

    before("Logo Component", () => {
        logoComponent = TestUtils.renderIntoDocument(
            <Logo />
        );
    });

    it("should have logo image ", () => {
        let logoElementDOM = ReactDOM.findDOMNode(logoComponent.refs.logo);
        assert.isNotNull(logoElementDOM);
    });
});
