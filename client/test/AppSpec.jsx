/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import "./helper/TestHelper";
import App from "../src/js/App";

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { findAllWithType } from "react-shallow-testutils";

describe("app component", function() {
    it("should have two children in properties", function() {
        const children = [<App key="1" children={[]} />, <App key="2" children={[]} />];
        const renderer = TestUtils.createRenderer();
        renderer.render(<App children={children}/>);
        const result = renderer.getRenderOutput();
        const renderedChildren = findAllWithType(result, App);
        assert.strictEqual(renderedChildren.length, 2); // eslint-disable-line no-magic-numbers
    });
});
