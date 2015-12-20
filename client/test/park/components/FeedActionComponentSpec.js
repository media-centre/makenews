"use strict";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import FeedActionComponent from "../../../src/js/park/components/FeedActionComponent.jsx";


describe("FeedActionComponent", () => {
    let feedActionComponent = null;

    before("FeedActionComponent", () => {
        feedActionComponent = TestUtils.renderIntoDocument(
          <FeedActionComponent />
       );
    });

    it("should have feed action image", () => {
        let imageDOM = ReactDOM.findDOMNode(feedActionComponent.refs.image);
        assert.isNotNull(imageDOM);
    });
});
