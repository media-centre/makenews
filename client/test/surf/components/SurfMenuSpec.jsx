/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import SurfMenu from "../../../src/js/surf/components/SurfMenu.jsx";
import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../helper/TestHelper.js";

describe("SurfMenu", () => {
    let surfMenuComponent = null;

    before("SurfMenu", () => {
        surfMenuComponent = TestUtils.renderIntoDocument(
            <SurfMenu/>
        );
    });

    it("should have link to /surf", () => {
        let linkElement = TestUtils.scryRenderedComponentsWithType(surfMenuComponent, Link);
        assert.strictEqual("/surf", linkElement[0].props.to);
    });
});

