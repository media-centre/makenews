/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import FeaturesHelp from "../../../src/js/login/components/FeaturesHelp";

import { assert } from "chai";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import React from "react";
import "../../helper/TestHelper";

describe("FeaturesHelp", () => {
    let featuresHelpComponent = null;

    before("FeaturesHelp", () => {
        let featuresHelp = {
            "configureHelp": {
                "name": "Test Configure Name",
                "text": "sample Configure text"
            },
            "surfHelp": {
                "name": "Test Surf Name",
                "text": "sample Surf text"
            },
            "parkHelp": {
                "name": "Test Park Name",
                "text": "sample Park text"
            }
        };
        featuresHelpComponent = TestUtils.renderIntoDocument(
            <FeaturesHelp featuresHelp= {featuresHelp}/>
        );
    });

    it("should have configure feature help", () => {
        let configureFeatureHelpDOM = ReactDOM.findDOMNode(featuresHelpComponent.refs.configureFeatureHelp);
        assert.isNotNull(configureFeatureHelpDOM);
    });

    it("should have surf feature help", () => {
        let surfFeatureHelpDOM = ReactDOM.findDOMNode(featuresHelpComponent.refs.surfFeatureHelp);
        assert.isNotNull(surfFeatureHelpDOM);
    });

    it("should have park feature help", () => {
        let parkFeatureHelpDOM = ReactDOM.findDOMNode(featuresHelpComponent.refs.parkFeatureHelp);
        assert.isNotNull(parkFeatureHelpDOM);
    });
});

