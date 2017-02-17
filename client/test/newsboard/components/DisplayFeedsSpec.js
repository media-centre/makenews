import DisplayFeeds from "../../../src/js/newsboard/components/DisplayFeeds";
import Feed from "../../../src/js/newsboard/components/Feed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";
import sinon from "sinon";
import DisplayCollection from "../../../src/js/newsboard/components/DisplayCollection";

describe("DisplayFeeds", () => {
    let result = null, feeds = null, store = null;
    let sandbox = sinon.sandbox.create();
    beforeEach("DisplayFeeds", () => {
        feeds = [
            { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];
        store = createStore(() => ({
            "fetchedFeeds": feeds,
            "selectedArticle": {
                "_id": "1234"
            },
            "newsBoardCurrentSourceTab": "web",
            "currentFilterSource": { "web": [], "facebook": [], "twitter": [] }
        }), applyMiddleware(thunkMiddleware));

        sandbox.useFakeTimers();

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayFeeds />
            </Provider>);
    });

    afterEach("DisplayFeeds", () => {
        sandbox.restore();
    });

    it("should render the feeds", () => {
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, Feed);
        expect(renderedSources).to.have.lengthOf(2);  //eslint-disable-line no-magic-numbers
    });

    it("should not have expand class by default", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "news-feeds-container");
        expect(displayFeeds.className).to.equal("news-feeds-container");
    });

    it("should have expand class when we click on expand icon", () => {
        let renderedSources = TestUtils.findRenderedDOMComponentWithClass(result, "expand-icon");
        TestUtils.Simulate.click(renderedSources);

        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "news-feeds-container");
        expect(displayFeeds.className).to.contains("expand");
    });

    describe("Collections", () => {
        it("should have Display collection", () => {
            feeds = [
                { "_id": "1234", "collection": "collection1" }
            ];
            store = createStore(() => ({
                "fetchedFeeds": feeds,
                "selectedArticle": {
                    "_id": "1234"
                },
                "newsBoardCurrentSourceTab": "collections",
                "currentHeaderTab": "Scan News"

            }), applyMiddleware(thunkMiddleware));

            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayFeeds />
                </Provider>);

            let renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayCollection);
            expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
        });
    });
});
