/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper.js";
import { ParkPage } from "../../../src/js/park/pages/ParkPage.jsx";
import ParkFeedActionComponent from "../../../src/js/park/components/ParkFeedActionComponent.jsx";
import AllFeeds from "../../../src/js/surf/components/AllFeeds.jsx";

describe("park Page", () => {

    it("should have default text ", () => {
        let feeds = [];
        let parkComponent = TestUtils.renderIntoDocument(
            <ParkPage parkedItems={feeds} dispatch={()=>{}}/>
        );
        let parkDOM = ReactDOM.findDOMNode(parkComponent.refs.defaultText);
        assert.strictEqual("No feeds found", parkDOM.innerHTML);
    });

    it("should not have default text if feeds are there", () => {
        let feeds = ["test"];
        let parkComponent = TestUtils.renderIntoDocument(
            <ParkPage parkedItems={feeds} dispatch={()=>{}}/>
        );
        let parkDOM = ReactDOM.findDOMNode(parkComponent.refs.defaultText);
        assert.notOk(parkDOM);
    });

    it("AllFeeds if feeds are there", () => {
        let feeds = ["test"];
        let parkComponent = TestUtils.renderIntoDocument(
            <ParkPage parkedItems={feeds} actionComponent={ParkFeedActionComponent} dispatch={()=>{}}/>
        );
        const allFeeds = TestUtils.findRenderedComponentWithType(parkComponent, AllFeeds);
        assert(allFeeds);
        assert.deepEqual(allFeeds.props.feeds, feeds);
        assert.deepEqual(allFeeds.props.actionComponent, ParkFeedActionComponent);
    });
});

