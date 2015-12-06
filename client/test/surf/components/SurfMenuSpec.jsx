/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import SurfMenu from "../../../src/js/surf/components/SurfMenu.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../helper/TestHelper.js";

describe("SurfMenu", () => {
    let surfMenuComponent = null, surfTab = null;

    before("SurfMenu", () => {
        surfTab = {
            "Name": "Surf Test"
        };
        surfMenuComponent = TestUtils.renderIntoDocument(
            <SurfMenu surfTab ={surfTab}/>
        );
    });

    it("should have link to /surf", () => {
        let linkElement = TestUtils.scryRenderedComponentsWithType(surfMenuComponent, Link);
        assert.strictEqual("/surf", linkElement[0].props.to);
    });

    it("should display the surf tab name from the locale file", () => {
        assert.strictEqual("Surf Test", surfMenuComponent.refs.surfTabName.innerHTML);
    });

});


