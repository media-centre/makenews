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

describe("Display Collections", () => {
    let feeds = null, store = null, result = null;
    let sandbox = null;

    beforeEach("Display Collection", () => {
        feeds = [
            { "_id": "1234", "collection": "collection1" },
            { "_id": "12345", "collection": "politics" }
        ];
        store = createStore(() => ({
            "fetchedFeeds": feeds,
            "newsBoardCurrentSourceTab": "collections"

        }), applyMiddleware(thunkMiddleware));

        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <DisplayCollection />
            </Provider>);

        sandbox = sinon.sandbox.create();
    });

    afterEach("DisplayFeeds", () => {
        sandbox.restore();
    });

    it("should render collections when the souretype is collection", () => {
        //eslint-disable-next-line no-magic-numbers
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 2);

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

    it("should have an search input box", () => {
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(result, "input-box"));
    });

    it("should render the filtered collection names only, after entering the keyword in searchbar", () => {
        //eslint-disable-next-line no-magic-numbers
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 2);

        let displayFeedDom = ReactDOM.findDOMNode(result);
        let inputBox = displayFeedDom.querySelector(".input-box input");
        inputBox.value = "politic";
        TestUtils.Simulate.keyUp(inputBox, { "key": "s" });

        let collections = TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name");
        //eslint-disable-next-line no-magic-numbers
        assert.equal(TestUtils.scryRenderedDOMComponentsWithClass(result, "collection-name").length, 1);
        //eslint-disable-next-line no-magic-numbers
        assert.equal(collections[0].textContent, " politics");
    });
});
