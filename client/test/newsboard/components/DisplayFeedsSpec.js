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
import DisplayArticle from "../../../src/js/newsboard/components/DisplayArticle";
import { SCAN_NEWS, WRITE_A_STORY } from "./../../../src/js/header/HeaderActions";
import * as DisplayFeedActions from "./../../../src/js/newsboard/actions/DisplayFeedActions";

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
                <DisplayFeeds currentHeaderTab={SCAN_NEWS}/>
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
                "currentFilterSource": { "web": [] }
            }), applyMiddleware(thunkMiddleware));

            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayFeeds currentHeaderTab={SCAN_NEWS}/>
                </Provider>);

            let renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayCollection);
            expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
        });
    });

    /*TODO: update the state from test*/ //eslint-disable-line
    xdescribe("write a story", () => {
        it("should have Display Article", () => {
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
                "currentFilterSource": { "web": [] }
            }), applyMiddleware(thunkMiddleware));

            result = TestUtils.renderIntoDocument(
                    <DisplayFeeds store={store} currentHeaderTab={WRITE_A_STORY}/>);
            result.setState({ "isClicked": true });

            let renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayArticle);
            expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
        });
    });

    describe("search", () => {
        it("should have search bar", () => {
            let searchBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-bar");
            expect(searchBox.className).to.equal("search-bar");
        });

        it("should have input Box", () => {
            let inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "input-box");
            expect(inputBox.className).to.equal("input-box");
        });

        it("should dispatch search feeds", () => {
            let searchKey = "test";
            let offset = 0, sourceType = "web";
            let inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-sources");
            inputBox.value = "test";
            let searchFeedsMock = sandbox.mock(DisplayFeedActions).expects("searchFeeds")
                .withArgs(sourceType, searchKey, offset).returns({ "type": "" });
            let addOn = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(addOn);

            searchFeedsMock.verify();
        });

        it("should dispatch display feeds by page", () => {
            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayFeeds currentHeaderTab={SCAN_NEWS}/>
                </Provider>);

            let inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-sources");
            inputBox.value = "test";
            let searchFeedsMock = sandbox.mock(DisplayFeedActions).expects("displayFeedsByPage").returns({ "type": "" });
            let search = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(search);

            let cross = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(cross);
            searchFeedsMock.verify();
        });
    });
});
