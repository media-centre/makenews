import DisplayFeeds from "../../../src/js/newsboard/components/DisplayFeeds";
import Feed from "../../../src/js/newsboard/components/Feed";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { expect, assert } from "chai";
import sinon from "sinon";
import * as DisplayArticleActions from "../../../src/js/newsboard/actions/DisplayArticleActions";


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
            "currentFilterSource": "web"
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
        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
        expect(displayFeeds.className).to.equal("configured-feeds-container");
    });

    it("should have expand class when we click on expand icon", () => {
        let renderedSources = TestUtils.findRenderedDOMComponentWithClass(result, "expand-icon");
        TestUtils.Simulate.click(renderedSources);

        let displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
        expect(displayFeeds.className).to.contains("expand");
    });

    describe("Collections", () => {
        beforeEach("DisplayFeeds", () => {
            feeds = [
                { "_id": "1234", "collection": "collection1" }
            ];
            store = createStore(() => ({
                "fetchedFeeds": feeds,
                "selectedArticle": {
                    "_id": "1234"
                },
                "newsBoardCurrentSourceTab": "collections"

            }), applyMiddleware(thunkMiddleware));

            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayFeeds />
                </Provider>);
        });

        afterEach("DisplayFeeds", () => {
            sandbox.restore();
        });

        it("should render collections when the souretype is collection", () => {
            assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "collection-name"));

        });
        it("should show popup when create new collection is clicked", () => {
            let createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
            TestUtils.Simulate.click(createCollectionElement);
            assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "new-collection"));
        });

        it("should dispatch addToCollection when save button is clicked", () => {
            let createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
            TestUtils.Simulate.click(createCollectionElement);
            let addToCollectionMock = sandbox.mock(DisplayArticleActions)
                .expects("addToCollection")
                .returns({ "type": "" });
            let displayFeedDOM = ReactDOM.findDOMNode(result);
            let inputBox = displayFeedDOM.querySelectorAll(".new-collection-input-box")[0]; //eslint-disable-line no-magic-numbers
            inputBox.value = "collectionName";
            let saveCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "save-collection");
            TestUtils.Simulate.click(saveCollectionElement);
            addToCollectionMock.verify();
        });

        it("should dispatch addToCollection on keyup", () => {
            let createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
            TestUtils.Simulate.click(createCollectionElement);
            let addToCollectionMock = sandbox.mock(DisplayArticleActions)
                .expects("addToCollection")
                .returns({ "type": "" });
            let displayFeedDOM = ReactDOM.findDOMNode(result);
            let inputBox = displayFeedDOM.querySelectorAll(".new-collection-input-box")[0]; //eslint-disable-line no-magic-numbers
            inputBox.value = "collectionName";
            TestUtils.Simulate.keyUp(inputBox, { "keyCode": 13 });
            addToCollectionMock.verify();
        });
    });
});
