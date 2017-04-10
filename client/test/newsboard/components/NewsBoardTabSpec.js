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
            "newsBoardCurrentSourceTab": currentTab,
            "fetchingFeeds": false
        }), applyMiddleware(thunkMiddleware));
        newsBoardTab = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <NewsBoard sourceIcon="twitter" sourceType={"twitter"} title="bookmarked feeds"/>
            </Provider>
        );
    });

    it("should dispatch newsBoardTabSwitch if we click when fetchingFeeds is false", () => {
        sandbox = sinon.sandbox.create();
        const newsBoardTabSwitchMock = sandbox.mock(DisplayFeedActions).expects("newsBoardTabSwitch").returns({
            "type": ""
        });
        const newsBoardTabDOM = ReactDOM.findDOMNode(newsBoardTab);
        const [icon] = newsBoardTabDOM.getElementsByClassName("icon");
        
        TestUtils.Simulate.click(icon);
        
        newsBoardTabSwitchMock.verify();
        sandbox.restore();
    });

    it("should not dispatch newsBoardTabSwitch if we click when fetchingFeeds is true", () => {
        sandbox = sinon.sandbox.create();
        store = createStore(() => ({
            "newsBoardCurrentSourceTab": currentTab,
            "fetchingFeeds": true
        }), applyMiddleware(thunkMiddleware));
        newsBoardTab = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <NewsBoard sourceIcon="twitter" sourceType={"twitter"} title="bookmarked feeds"/>
            </Provider>
        );

        const newsBoardTabSwitchMock = sandbox.mock(DisplayFeedActions).expects("newsBoardTabSwitch").never();
        const newsBoardTabDOM = ReactDOM.findDOMNode(newsBoardTab);
        const [icon] = newsBoardTabDOM.getElementsByClassName("icon");

        TestUtils.Simulate.click(icon);

        newsBoardTabSwitchMock.verify();
        sandbox.restore();
    });

    it("should have icon", () => {
        const sourceType = newsBoardTab.props.children.props.sourceType;
        const newsBoardTabClass = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, `icon fa fa-${sourceType}`).className;
        expect(newsBoardTabClass).to.be.equals("icon fa fa-twitter");
    });

    it("should have className ", () => {
        const newsBoardTabClass = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, "news-board-tab").className;
        expect(newsBoardTabClass).to.be.equals("news-board-tab");
    });

    it("should have title attribute", () => {
        const newsBoardTabDOM = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, "news-board-tab");
        expect(newsBoardTabDOM.title).to.be.equals("bookmarked feeds");
    });

    it("current tab should highlight if both sourcetype and current tabs are equal", () => {
        newsBoardTab = TestUtils.renderIntoDocument(<Provider store={store}><NewsBoard sourceIcon="web" sourceType={"web"}/></Provider>);
        const newsBoardTabDOM = TestUtils.findRenderedDOMComponentWithClass(newsBoardTab, "news-board-tab").className;
        expect(newsBoardTabDOM).to.be.equals("news-board-tab active");
    });
});
