"use strict";
import "../helper/TestHelper.js";
import MainPage from "../../src/js/main/pages/MainPage.jsx";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";

import { expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";

describe("main page component", () => {
    let mainPage = null;
    before("Main page component", () => {
        let childElement = <div>{"main-page children"}</div>;
        mainPage = TestUtils.renderIntoDocument(<MainPage children={childElement}/>);
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

});
