import DisplayFeeds from "../../../src/js/newsboard/components/DisplayFeeds";
import Feed from "../../../src/js/newsboard/components/Feed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";
import * as DisplayFeedActions from "./../../../src/js/newsboard/actions/DisplayFeedActions";
import sinon from "sinon";

describe("DisplayFeeds", () => {
    let result = null;
    let sandbox = null;
    beforeEach("DisplayFeeds", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("DisplayFeeds", () => {
        sandbox.restore();
    });

    it("should render the feeds", () => {
        let feeds = [
            { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];
        let store = createStore(() => ({
            "fetchedFeeds": feeds
        }), applyMiddleware(thunkMiddleware));

        sandbox.mock(DisplayFeedActions).expects("displayFeedsByPage").returns(
            { "type": "something" }
        );

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayFeeds />
            </Provider>);
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, Feed);
        expect(renderedSources).to.have.lengthOf(2);  //eslint-disable-line no-magic-numbers
    });

});
