/*eslint no-magic-numbers:0 */
"use strict";
import "../helper/TestHelper.js";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";
import { assert, expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("main header component", () => {
    let mainHeader = null, headerStrings = null;
    before("Main page component", () => {
        headerStrings = {
            "surfTab": {
                "Name": "Surf"
            },
            "parkTab": {
                "Name": "Park"
            },
            "configTab": {
                "Name": "Configure"
            },
            "logoutButton": {
                "Name": "Logout"
            }
        };

        mainHeader = TestUtils.renderIntoDocument(<MainHeader headerStrings={headerStrings}/>);
    });

    it("should have header element", () => {
        var mainHeaderDomNode = ReactDOM.findDOMNode(mainHeader);
        expect(mainHeaderDomNode.tagName).to.equal("header".toUpperCase());
    });

    it("should have div with fixed-header clear-fix multi-column", () => {
        expect(TestUtils.findRenderedDOMComponentWithClass(mainHeader, "fixed-header clear-fix multi-column").className)
                                                            .to.equal("fixed-header clear-fix multi-column");
    });

    it("should have logo on left", () => {
        let logoElement = mainHeader.refs.logo;
        assert.isDefined(logoElement);
    });

    it("should have logout component", () => {
        let logOutElement = mainHeader.refs.logout;
        assert.isDefined(logOutElement);
    });

    it("should have configure menu component", () => {
        let menuElement = mainHeader.refs.configureMenu;
        assert.isDefined(menuElement);
    });

    it("should have surf menu component", () => {
        let menuElement = mainHeader.refs.surfMenu;
        assert.isDefined(menuElement);
    });

    it("should have park menu component", () => {
        let menuElement = mainHeader.refs.parkMenu;
        assert.isDefined(menuElement);
    });

    it("should have surf menu name for the Surf Menu component", () => {
        let menuElement = mainHeader.refs.surfMenu;
        assert.strictEqual("Surf", menuElement.props.surfTab.Name);
    });

    it("should have park name for the Park Menu component", () => {
        let menuElement = mainHeader.refs.parkMenu;
        assert.strictEqual("Park", menuElement.props.parkTab.Name);
    });

    it("should have configure name for the Config Menu component", () => {
        let menuElement = mainHeader.refs.configureMenu;
        assert.strictEqual("Configure", menuElement.props.configTab.Name);
    });

    it("should have logout name for the logout component", () => {
        let menuElement = mainHeader.refs.logout;
        assert.strictEqual("Logout", menuElement.props.logoutButton.Name);
    });

});
