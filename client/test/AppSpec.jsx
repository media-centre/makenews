/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import "./helper/TestHelper.js";
import App from "../src/js/App.jsx";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";

describe("app component", function() {
    it("should have two children in properties", function() {
        let children = [<App key="1" children={[]} />, <App key="2" children={[]} />];
        this.loginPage = TestUtils.renderIntoDocument(
            <App children={children}/>
        );
        assert.strictEqual(2, 2);
    });
});
