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
          <ParkFeedActionComponent />
       );
    });

    it("should have feed action image", () => {
        let imageDOM = ReactDOM.findDOMNode(feedActionComponent.refs.image);
        assert.isNotNull(imageDOM);
    });
});
