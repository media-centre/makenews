"use strict";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ParkFeedActionComponent from "../../../src/js/park/components/ParkFeedActionComponent.jsx";


describe("ParkFeedActionComponent", () => {
    let feedActionComponent = null;

    before("ParkFeedActionComponent", () => {
        feedActionComponent = TestUtils.renderIntoDocument(
          <ParkFeedActionComponent feedAction={()=> {}}/>
       );
    });

    it("should have feed action icon to move back to surf", () => {
        let iconDOM = ReactDOM.findDOMNode(feedActionComponent.refs.reply);
        assert.equal(iconDOM._classList[1], "fa-reply");
    });
});
