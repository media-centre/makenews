/* eslint no-unused-expressions:0, max-nested-callbacks:0 */
"use strict";
import { SurfPage } from "../../../src/js/surf/pages/SurfPage.jsx"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";


let surfPageComponent = null;
let props = {
    "messages": {
        "fetchingFeeds": "fetching feeds"
    },
    "allFeeds": []
};

describe("SurfPage", ()=> {
    describe("Refresh button", ()=> {
        xit("should be present", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds}/>
            );
            assert.isDefined(surfPageComponent.refs.surfRefreshButton, "defined");
        });

        xit("should be enabled by default", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds}/>
            );
            assert.isFalse(surfPageComponent.state.refreshState);
            assert.isFalse(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });

        xit("should be disabled once clicked to fetch updated feeds", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds}/>
            );
            TestUtils.Simulate.click(surfPageComponent.refs.surfRefreshButton);
            assert.isTrue(surfPageComponent.state.refreshState);
            assert.isTrue(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });
    });
});
