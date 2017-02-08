import DisplayCollectionFeeds from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";
import CollectionFeed from "../../../src/js/newsboard/components/CollectionFeed";
import { DisplayArticle } from "../../../src/js/newsboard/components/DisplayArticle";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect } from "chai";

describe("DisplayCollectionFeeds", () => {
    let result = null, feeds = null, store = null, collectionName = null, readMore = null;

    beforeEach("DisplayCollectionFeeds", () => {
        collectionName = "test";
        readMore = false;
        feeds = [
            { "_id": "1234", "sourceUrl": "http://www.test.com", "docType": "feed", "tags": [], "videos": [], "images": [] },
            { "_id": "12345", "sourceUrl": "http://www.test2.com", "docType": "feed", "tags": [], "videos": [], "images": [] }
        ];
        store = createStore(() => ({
            "displayCollection": feeds,
            "currentCollection": collectionName,
            "readMore": readMore
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

    it("should have header class", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "collection-header");
        expect(displayFeeds.className).to.equal("collection-header");
    });

    it("should have collection-feeds class", () => {
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "collection-feeds");
        expect(displayFeeds.className).to.equal("collection-feeds");
    });

    /* TODO: fix the testcase*/ //eslint-disable-line
    xit("should have display Article when read more is true", () => {
        readMore = true;
        store = createStore(() => ({
            "displayCollection": feeds,
            "currentCollection": collectionName,
            "readMore": readMore
        }), applyMiddleware(thunkMiddleware));


        result = TestUtils.renderIntoDocument(<Provider store={store}>
            <DisplayCollectionFeeds dispatch={() => {}} feeds={feeds} collectionName={collectionName} readMore={readMore}/>
            </Provider>);
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayArticle);
        expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
    });
});

