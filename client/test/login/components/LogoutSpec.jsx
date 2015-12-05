/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import Logout from "../../../src/js/login/components/Logout.jsx";
import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { Link } from "react-router";
import "../../helper/TestHelper.js";

describe("Logout", () => {
    let logoutComponent = null;

    before("Logout", () => {
        logoutComponent = TestUtils.renderIntoDocument(
            <Logout/>
        );
    });

    it("should have Logout", () => {
        let listComponents = TestUtils.scryRenderedComponentsWithType(logoutComponent, Link);
        expect(listComponents[0].props.to).to.equal("/");
        expect(listComponents[0].props.className).to.equal("link highlight-on-hover");
    });

    it("Logout OnClick event", () => {
        let listComponents = TestUtils.scryRenderedComponentsWithType(logoutComponent, Link);
        TestUtils.Simulate.click(listComponents[0]);
    });


});

