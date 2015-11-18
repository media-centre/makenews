"use strict";
import "../helper/TestHelper.js";
import MainPage from "../../src/js/main/pages/MainPage.jsx";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";

import { expect } from "chai";
import React from "react/addons";
import ReactDOM from "react-dom";

let TestUtils = React.addons.TestUtils;

describe("main page component", function() {
    before("Main page component", function() {
        let childElement = <div>{"mainpage children"}</div>;
        this.mainPage = TestUtils.renderIntoDocument(<MainPage children={childElement}/>);
    });

    it("should have div with className main-page", function() {
        var mainPageDomNode = ReactDOM.findDOMNode(this.mainPage);
        expect(mainPageDomNode.className).to.equal("main-page");
    });

    it("should have MainHeader component", function() {
        expect(TestUtils.scryRenderedComponentsWithType(this.mainPage, MainHeader).length).to.equal(1);
    });

    it("should have section with children", function() {
        let sectionTag = TestUtils.findRenderedDOMComponentWithTag(this.mainPage, "section");
        expect(sectionTag.tagName).to.equal("section".toUpperCase());
        expect(sectionTag.firstChild.textContent).to.equal("mainpage children");
    });

});
