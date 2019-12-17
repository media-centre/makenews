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
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayFeeds", () => {
    let result = null;
    let feeds = null;
    let store = null;
    const sandbox = sinon.sandbox.create();
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
        const newsBoardStrings = {
            "defaultMessages": {
                "trending": "Please configure sources on configure page",
                "web": "Please configure web sources on configure page",
                "facebook": "Please configure facebook sources on configure page",
                "twitter": "Please configure twitter sources on configure page",
                "bookmark": "Please bookmark the feeds",
                "noFeeds": "No feeds to display"
            },
            "search": {
                "validateKey": "Please enter a keyword minimum of 3 characters"
            },
            "showMoreFeedsButton": "Show new feeds",
            "collection": {
                "createCollection": "Create new collection"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings
            }
        });
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayFeeds currentHeaderTab={SCAN_NEWS}/>
            </Provider>);
    });

    afterEach("DisplayFeeds", () => {
        sandbox.restore();
    });

    it("should render the feeds", () => {
        const renderedSources = TestUtils.scryRenderedComponentsWithType(result, Feed);
        expect(renderedSources).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
    });

    it("should not have expand class by default", () => {
        const displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
        expect(displayFeeds.className).to.equal("configured-feeds-container");
    });

    it("should have feeds-container class", () => {
        const feedsContainer = TestUtils.findRenderedDOMComponentWithClass(result, "feeds-container");
        expect(feedsContainer).to.not.be.undefined; //eslint-disable-line no-unused-expressions
    });

    it("should have expand class when we click on expand icon", () => {
        const renderedSources = TestUtils.findRenderedDOMComponentWithClass(result, "expand-icon");
        TestUtils.Simulate.click(renderedSources);

        const displayFeeds = TestUtils.findRenderedDOMComponentWithClass(result, "configured-feeds-container");
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

            const renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayCollection);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
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

            const renderedSources = TestUtils.scryRenderedComponentsWithType(result, DisplayArticle);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
        });
    });

    describe("search", () => {
        it("should have search bar", () => {
            const searchBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-bar");
            expect(searchBox.className).to.equal("search-bar");
        });

        it("should have input Box", () => {
            const inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "input-box");
            expect(inputBox.className).to.equal("input-box");
        });

        it("should dispatch search feeds", () => {
            const searchKey = "test";
            const offset = 0;
            const sourceType = "web";
            const inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-sources");
            inputBox.value = "test";
            const searchFeedsMock = sandbox.mock(DisplayFeedActions).expects("searchFeeds")
                .withArgs(sourceType, searchKey, offset).returns({ "type": "" });
            const addOn = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(addOn);

            searchFeedsMock.verify();
        });

        it("should dispatch display feeds by page", () => {
            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayFeeds currentHeaderTab={SCAN_NEWS}/>
                </Provider>);

            const inputBox = TestUtils.findRenderedDOMComponentWithClass(result, "search-sources");
            inputBox.value = "test";
            const searchFeedsMock = sandbox.mock(DisplayFeedActions).expects("displayFeedsByPage").returns({ "type": "" });
            const search = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(search);

            const cross = TestUtils.findRenderedDOMComponentWithClass(result, "input-addon");
            TestUtils.Simulate.click(cross);
            searchFeedsMock.verify();
        });
    });
});
