import DisplayCollectionFeeds from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";

describe("DisplayCollectionFeeds", () => {
    let result = null, feeds = null, store = null;

    beforeEach("DisplayCollectionFeeds", () => {
        feeds = [
            { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];
        store = createStore(() => ({
            "displayCollection": feeds
        }), applyMiddleware(thunkMiddleware));


        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayCollectionFeeds />
            </Provider>);
    });


    it("should render the feeds", () => {
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, CollectionFeed);
        expect(renderedSources).to.have.lengthOf(2);  //eslint-disable-line no-magic-numbers
    });

    it("should have display-collection class", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "display-collection");
        expect(displayFeeds.className).to.equal("display-collection");
    });

    it("should have collection-feeds class", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "collection-feeds");
        expect(displayFeeds.className).to.equal("collection-feeds");
    });
});
