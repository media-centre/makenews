"use strict";
import "../helper/TestHelper.js";
import MainHeader from "../../src/js/main/headers/MainHeader.jsx";
import { Link } from "react-router";

import { expect } from "chai";
import React from "react/addons";
import ReactDOM from "react-dom";

let TestUtils = React.addons.TestUtils;

describe("main header component", () => {
    let mainHeader = null;
    before("Main page component", () => {
        mainHeader = TestUtils.renderIntoDocument(<MainHeader />);
    });

    it("should have header element", () => {
            var mainHeaderDomNode = ReactDOM.findDOMNode(mainHeader);
            expect(mainHeaderDomNode.tagName).to.equal("header".toUpperCase());
        });

    it("should have div with fixed-header clear-fix multi-column", () => {
        expect(TestUtils.findRenderedDOMComponentWithClass(mainHeader, "fixed-header clear-fix multi-column").className)
                                                            .to.equal("fixed-header clear-fix multi-column");
    });

    it("should have Logout", () => {
        let listComponents = TestUtils.scryRenderedComponentsWithType(mainHeader, Link);
        expect(listComponents[0].props.to).to.equal("/");
        expect(listComponents[0].props.className).to.equal("link highlight-on-hover");
    });

    it("Logout OnClick event", () => {
            let listComponents = TestUtils.scryRenderedComponentsWithType(mainHeader, Link);
            TestUtils.Simulate.click(listComponents[0]);
        });

    it("should have header list items", () => {
            let listComponents = TestUtils.scryRenderedComponentsWithType(mainHeader, Link);
            var testHeaderList = (listItem, path, name) => {
                            expect(listItem.props.to).to.equal(path);
                            expect(listItem.props.activeClassName).to.equal("selected");
                            expect(listItem.props.children[0].type).to.equal("div");
                            expect(listItem.props.children[1].props.children).to.equal(name);
                        };
            testHeaderList(listComponents[1], "/configure/categories", "Configure");
            testHeaderList(listComponents[2], "/surf", "Surf");
            testHeaderList(listComponents[3], "/park", "Park");
    });
});
