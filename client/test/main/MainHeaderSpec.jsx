/*eslint no-magic-numbers:0 */
"use strict";
import "../helper/TestHelper.js";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";
import { assert, expect } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import sinon from "sinon";
import Locale from "../../src/js/utils/Locale";

describe("main header component", () => {
    let mainHeader = null, headerStrings = null, highlightedTab = null, sandbox = null;
    beforeEach("Main page component", () => {
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
        let parkCounter = 0;
        sandbox = sinon.sandbox.create();

        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "userProfileSettings": {}
            }
        });
        sandbox.stub(localStorage, "getItem").withArgs("UserName").returns("test");
        mainHeader = TestUtils.renderIntoDocument(<MainHeader headerStrings={headerStrings} highlightedTab={highlightedTab} parkCounter={parkCounter}/>);
    });

    afterEach("Main page component", () => {
        sandbox.restore();
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
});
