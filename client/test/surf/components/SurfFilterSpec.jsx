/* eslint max-nested-callbacks:0 */

"use strict";
import SurfFilter from "../../../src/js/surf/components/SurfFilter.jsx"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDom from "react-dom";
import "../../helper/TestHelper.js";

describe("SurfFilter Component", ()=> {
    let mediaTypes = [
        {
            "name": "Text",
            "image": "file-text-o"
        }, {
            "name": "Pictures",
            "image": "file-picture-o"
        }, {
            "name": "Videos",
            "image": "play-circle-o"
        }
    ];
    let categories = [
        {
            "_id": "12345",
            "name": "Category 1"
        }, {
            "_id": "23489",
            "name": "Category 2"
        }
    ];
    let filter = {
        "categories": categories,
        "mediaTypes": mediaTypes
    };

    describe("Category Filter", ()=> {
        it("should be present", ()=> {

            let surfFilter = TestUtils.renderIntoDocument(
                <SurfFilter filter={filter} categories={categories}/>
            );
            assert.isDefined(surfFilter, "defined");
        });

        it("should toggle button and which should show and hide the filter component", ()=> {
            let surfFilter = TestUtils.renderIntoDocument(
                <SurfFilter filter={filter} categories={categories}/>
            );
            let surfFilterDom = ReactDom.findDOMNode(surfFilter);
            TestUtils.Simulate.click(surfFilterDom.querySelector("#filterToggle"));
            assert.isTrue(surfFilter.state.show);
        });

        it("should toggle button and which should show and hide the filter component", ()=> {
            let surfFilter = TestUtils.renderIntoDocument(
                <SurfFilter filter={filter} categories={categories}/>
            );
            surfFilter.state.show = true;
            let surfFilterDom = ReactDom.findDOMNode(surfFilter);
            TestUtils.Simulate.click(surfFilterDom.querySelector("#filterToggle"));
            assert.isFalse(surfFilter.state.show);
        });


    });
});
