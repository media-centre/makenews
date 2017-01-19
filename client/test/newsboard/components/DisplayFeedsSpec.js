import DisplayFeeds from "../../../src/js/newsboard/components/DisplayFeeds";
import Feed from "../../../src/js/newsboard/components/Feed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";

describe("DisplayFeeds", () => {
    let result = null, feeds = null, store = null;
    beforeEach("DisplayFeeds", () => {
        feeds = [
            { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];
        store = createStore(() => ({
            "fetchedFeeds": feeds,
            "selectedArticle": {
                "_id": 1234
            }
        }), applyMiddleware(thunkMiddleware));

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayFeeds />
            </Provider>);
    });

    it("should render the feeds", () => {
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, Feed);
        expect(renderedSources).to.have.lengthOf(2);  //eslint-disable-line no-magic-numbers
    });

    it("should not have expand class by default", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
        expect(displayFeeds.className).to.equal("configured-feeds-container");
    });

    it("should have expand class when we click on expand icon", () => {
        let renderedSources = TestUtils.findRenderedDOMComponentWithClass(result, "expand-icon");
        TestUtils.Simulate.click(renderedSources);

        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
        expect(displayFeeds.className).to.contains("expand");
    });
});
