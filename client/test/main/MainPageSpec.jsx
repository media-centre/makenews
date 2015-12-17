"use strict";
import "../helper/TestHelper.js";
import { MainPage } from "../../src/js/main/pages/MainPage.jsx";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";

import { assert, expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("main page component", () => {
    let mainPage = null, headerStrings = null, highlightedTab = null;
    before("Main page component", () => {
        highlightedTab = {
            "tabNames": ["Surf"]
        };
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
        let childElement = <div>{"main-page children"}</div>;
        mainPage = TestUtils.renderIntoDocument(<MainPage children={childElement} headerStrings={headerStrings} highlightedTab={highlightedTab}/>);
    });

    it("should have div with className main-page", () => {
        var mainPageDomNode = ReactDOM.findDOMNode(mainPage);
        expect(mainPageDomNode.className).to.equal("main-page");
    });

    it("should have MainHeader component", () => {
        expect(TestUtils.scryRenderedComponentsWithType(mainPage, MainHeader).length).to.equal(1);
    });

    it("should have section with children", () => {
        let sectionTag = TestUtils.findRenderedDOMComponentWithTag(mainPage, "section");
        expect(sectionTag.tagName).to.equal("section".toUpperCase());
        expect(sectionTag.firstChild.textContent).to.equal("main-page children");
    });

    it("should have headerStrings property for MainHeader component", () => {
        assert.strictEqual("Surf", mainPage.refs.header.props.headerStrings.surfTab.Name);
    });

});
