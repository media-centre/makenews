/* eslint no-unused-expressions:0, max-nested-callbacks:0 */
"use strict";
import { SurfPage } from "../../../src/js/surf/pages/SurfPage.jsx"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import sinon from "sinon";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";
import Locale from "../../../src/js/utils/Locale";
import AppWindow from "../../../src/js/utils/AppWindow";


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
        let localeMock = null, sandbox = null;
        beforeEach("Refresh button", () => {
            sandbox = sinon.sandbox.create();
            localeMock = sandbox.mock(Locale).expects("applicationStrings");
            localeMock.returns({ "messages": "test messages" });
            sandbox.useFakeTimers();
        });
        afterEach("Refresh button", () => {
            sandbox.restore();
        });

        before("Refresh button", () => {
            sinon.stub(AppWindow, "instance").returns({ "get": () => {
                return true;
            } });
        });
        after("Refresh button", () => {
            AppWindow.instance.restore();
        });

        it("should be present", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds}/>
            );
            assert.isDefined(surfPageComponent.refs.surfRefreshButton, "defined");
        });

        it("should be enabled by default", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds} refreshState={props.refreshState}/>
            );
            assert.isFalse(surfPageComponent.state.refreshState);
            assert.isFalse(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });

        it("should be disabled once clicked to fetch updated feeds", ()=> {
            surfPageComponent = TestUtils.renderIntoDocument(
               <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds} refreshState={props.refreshState}/>
            );
            TestUtils.Simulate.click(surfPageComponent.refs.surfRefreshButton);
            assert.isTrue(surfPageComponent.state.refreshState);
            assert.isTrue(surfPageComponent.refs.surfRefreshButton.classList.contains("disabled"));
        });
    });

    describe("AutoRefresh", () => {
        afterEach("auto refresh", () => {
            clearInterval(AppWindow.instance().get("autoRefreshTimer"));
        });
        it("should refresh for the fixed time interval", () => {
            let sandbox = sinon.sandbox.create();
            let clock = sandbox.useFakeTimers();
            let localeMock = sandbox.stub(Locale, "applicationStrings");
            localeMock.returns({ "messages": "test messages" });
            surfPageComponent = TestUtils.renderIntoDocument(
                <SurfPage dispatch={()=>{}} messages={props.messages} feeds={props.allFeeds} refreshState={props.refreshState}/>
            );
            clock.tick(AppWindow.instance().get("autoRefreshSurfFeedsInterval"));
            assert.isTrue(surfPageComponent.state.refreshState);
            sandbox.restore();
        });
    });
});
