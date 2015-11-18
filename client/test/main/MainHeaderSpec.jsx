"use strict";
import "../helper/TestHelper.js";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";

import { expect } from "chai";
import React from "react/addons";
import ReactDOM from "react-dom";

let TestUtils = React.addons.TestUtils;

describe("main header component", function() {
    before("Main page component", function() {
        this.mainHeader = TestUtils.renderIntoDocument(<MainHeader />);
    });

    it("should have div with fixed-header clear-fix multi-column", function() {
        var mainHeaderDomNode = ReactDOM.findDOMNode(this.mainHeader);
        expect(mainHeader.className).to.equal("main-page");
    });

});
