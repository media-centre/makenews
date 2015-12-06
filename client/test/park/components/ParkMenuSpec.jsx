/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import ParkMenu from "../../../src/js/park/components/ParkMenu.jsx";
import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../helper/TestHelper.js";

describe("ParkMenu", () => {
    let parkMenuComponent = null, parkTab = null;

    before("ParkMenu", () => {
        parkTab = {
            "Name": "Park Test"
        };

        parkMenuComponent = TestUtils.renderIntoDocument(
            <ParkMenu parkTab={parkTab}/>
        );
    });

    it("should have link to /park", () => {
        let linkElement = TestUtils.scryRenderedComponentsWithType(parkMenuComponent, Link);
        assert.strictEqual("/park", linkElement[0].props.to);
    });

    it("should display the park tab name from the locale file", () => {
        assert.strictEqual("Park Test", parkMenuComponent.refs.parkTabName.innerHTML);
    });

});

