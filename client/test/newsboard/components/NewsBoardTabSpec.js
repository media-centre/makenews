import NewsBoard from "./../../../src/js/newsboard/components/NewsBoardTab";
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import TestUtils from "react-addons-test-utils";
import * as DisplayFeedActions from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import sinon from "sinon";
import { expect } from "chai";

describe("NewsBoardTab", () => {
    let sandbox = null, store = null, newsBoardTab = null, currentTab = null;

    beforeEach("NewsBoardTab", () => {
        currentTab = "web";
        store = createStore(() => ({
            "newsBoardCurrentSourceTab": currentTab
        }), applyMiddleware(thunkMiddleware));
        newsBoardTab = TestUtils.renderIntoDocument(<Provider store={store}><NewsBoard sourceIcon="twitter" sourceType={"twitter"}/></Provider>);
    });

    it("should have onclick function", () => {

        sandbox = sinon.sandbox.create();
        let newsBoardTabSwitchMock = sandbox.mock(DisplayFeedActions).expects("newsBoardTabSwitch").returns({
            "type": ""
        });
        let newsBoardTabDOM = ReactDOM.findDOMNode(newsBoardTab);
        TestUtils.Simulate.click(newsBoardTabDOM);
        newsBoardTabSwitchMock.verify();
        sandbox.restore();
    });

    it("should have icon", () => {
        let sourceType = newsBoardTab.props.children.props.sourceType;
        let newsBoardTabClass = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, `icon fa fa-${sourceType}`).className;
        expect(newsBoardTabClass).to.be.equals("icon fa fa-twitter");
    });

    it("should have className ", () => {
        let newsBoardTabClass = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, "news-board-tab").className;
        expect(newsBoardTabClass).to.be.equals("news-board-tab");
    });

    it("current tab should highlight if both sourcetype and current tabs are equal", () => {
        newsBoardTab = TestUtils.renderIntoDocument(<Provider store={store}><NewsBoard sourceIcon="web" sourceType={"web"}/></Provider>);
        let newsBoardTabClass = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, "news-board-tab").className;
        expect(newsBoardTabClass).to.be.equals("news-board-tab active");
    });

});
