/* eslint no-unused-expressions:0, max-nested-callbacks:0 */
"use strict";
import { SurfPage } from "../../../src/js/surf/pages/SurfPage.jsx"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import sinon from "sinon";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";
import Locale from "../../../src/js/utils/Locale";


let surfPageComponent = null;
let props = {
    "messages": {
        "fetchingFeeds": "fetching feeds"
    },
    "refreshState": false,
    "allFeeds": []
};

describe("SurfPage", ()=> {
    describe("Refresh button", ()=> {
        let localeMock = null, localeWithArgsMock = null, sandbox = null;
        beforeEach("Refresh button", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("Refresh button", () => {
            sandbox.restore();
        });
        it("should be present", ()=> {
            localeMock = sandbox.mock(Locale).expects("applicationStrings");
            localeMock.returns({ "messages": "test messages" });
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds}/>
            );
            assert.isDefined(surfPageComponent.refs.surfRefreshButton, "defined");
        });

        it("should be enabled by default", ()=> {
            localeMock = sandbox.mock(Locale).expects("applicationStrings");
            localeMock.returns({ "messages": "test messages" });
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds} refreshState={props.refreshState}/>
            );
            assert.isFalse(surfPageComponent.state.refreshState);
            assert.isFalse(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });

        it("should be disabled once clicked to fetch updated feeds", ()=> {
            localeMock = sandbox.stub(Locale, "applicationStrings");
            localeMock.returns({ "messages": "test messages" });
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds} refreshState={props.refreshState}/>
            );
            TestUtils.Simulate.click(surfPageComponent.refs.surfRefreshButton);
            assert.isTrue(surfPageComponent.state.refreshState);
            assert.isTrue(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });
    });
});
