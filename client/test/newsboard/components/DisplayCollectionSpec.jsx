/*eslint react/jsx-no-bind:0*/
import DisplayCollection from "./../../../src/js/newsboard/components/DisplayCollection";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { assert } from "chai";
import sinon from "sinon";
import * as DisplayArticleActions from "../../../src/js/newsboard/actions/DisplayArticleActions";
import Locale from "./../../../src/js/utils/Locale";

describe("Display Collections", () => {
    let feeds = null;
    let store = null;
    let result = null;
    const sandbox = sinon.sandbox.create();
    const anonymousFun = () => {};

    beforeEach("Display Collection", () => {
        feeds = [
            { "_id": "1234", "collection": "collection1" },
            { "_id": "12345", "collection": "politics" }
        ];
        store = createStore(() => ({
            "fetchedFeeds": feeds,
            "newsBoardCurrentSourceTab": "collections",
            "currentHeaderTab": "Scan News"

        }), applyMiddleware(thunkMiddleware));

        const newsBoardStrings = {
            "collection": {
                "defaultMessage": "No feeds added to collection",
                "allCollections": "All Collections",
                "selectCollection": "SELECT A COLLECTION",
                "createCollection": "Create new collection",
                "readMoreButton": "Read More",
                "backButton": "BACK",
                "saveButton": "SAVE",
                "confirmDelete": "Do you really want to delete collection?"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings,
                "confirmPopup": {
                    "ok": "OK",
                    "confirm": "CONFIRM",
                    "cancel": "CANCEL"
                }
            }
        });

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayCollection dispatch={anonymousFun}/>
            </Provider>);
    });

    afterEach("Display Collections", () => {
        sandbox.restore();
    });

    it("should render collections when the sourcetype is collection", () => {
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 2); //eslint-disable-line no-magic-numbers
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "delete-collection").length, 2); //eslint-disable-line no-magic-numbers
    });

    it("should show popup when create new collection is clicked", () => {
        const createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
        TestUtils.Simulate.click(createCollectionElement);
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "new-collection"));
    });

    it("should dispatch addToCollection when save button is clicked", () => {
        const createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
        TestUtils.Simulate.click(createCollectionElement);
        const addToCollectionMock = sandbox.mock(DisplayArticleActions)
            .expects("addToCollection")
            .returns({ "type": "" });
        const displayFeedDOM = ReactDOM.findDOMNode(result);
        const inputBox = displayFeedDOM.querySelectorAll(".new-collection-input-box")[0]; //eslint-disable-line no-magic-numbers
        inputBox.value = "collectionName";
        const saveCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "save-collection");
        TestUtils.Simulate.click(saveCollectionElement);
        addToCollectionMock.verify();
    });

    it("should dispatch addToCollection on keyup", () => {
        const createCollectionElement = TestUtils.findRenderedDOMComponentWithClass(result, "create_collection");
        TestUtils.Simulate.click(createCollectionElement);
        const addToCollectionMock = sandbox.mock(DisplayArticleActions)
            .expects("addToCollection")
            .returns({ "type": "" });
        const displayFeedDOM = ReactDOM.findDOMNode(result);
        const inputBox = displayFeedDOM.querySelectorAll(".new-collection-input-box")[0]; //eslint-disable-line no-magic-numbers
        inputBox.value = "collectionName";
        TestUtils.Simulate.keyUp(inputBox, { "keyCode": 13 });
        addToCollectionMock.verify();
    });

    it("should have an search input box", () => {
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "input-box"));
    });

    it("should render the filtered collection names only, after entering the keyword in searchbar", () => {
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 2); //eslint-disable-line no-magic-numbers

        const displayFeedDom = ReactDOM.findDOMNode(result);
        const inputBox = displayFeedDom.querySelector(".input-box input");
        inputBox.value = "politic";
        TestUtils.Simulate.keyUp(inputBox, { "key": "s" });
        const collections = TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name");

        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 1);//eslint-disable-line no-magic-numbers
        assert.equal(collections[0].textContent, "politics × "); //eslint-disable-line no-magic-numbers
    });

    describe("Display StoryBoard Collection", () => {
        beforeEach("Display StoryBoard Collection", () => {
            store = createStore(() => ({
                "fetchedFeeds": feeds,
                "newsBoardCurrentSourceTab": "collections",
                "currentHeaderTab": "Write a Story"

            }), applyMiddleware(thunkMiddleware));

            result = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <DisplayCollection dispatch={anonymousFun}/>
                </Provider>);
        });

        it("should have main div", () => {
            assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "collection-list-container"));
        });
        it("should have feeds div", () => {
            assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "feeds"));
        });
        it("should have select_collection div", () => {
            assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "select_collection"));
        });
    });
});
