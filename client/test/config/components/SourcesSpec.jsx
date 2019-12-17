import Sources from "../../../src/js/config/components/Sources";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import Source from "../../../src/js/config/components/Source";
import sinon from "sinon";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import Spinner from "./../../../src/js/utils/components/Spinner";

describe("Sources", () => {
    let sources = null;
    let sandbox = null;
    let result = null;
    let currentTab = null;
    let store = null;

    beforeEach("SourcePane", () => {
        sources = { "data": [
            { "name": "Profile 1" },
            { "name": "Profile 2" }
        ], "paging": "" };

        currentTab = "Profiles";

        sandbox = sinon.sandbox.create();
    });

    afterEach("SourcePane", () => {
        sandbox.restore();
    });

    it("should render Sources", () => {
        store = createStore(() => ({
            "currentSourceTab": currentTab,
            "sourceResults": sources,
            "hasMoreSourceResults": false,
            "sourceSearchKeyword": "Bla"
        }), applyMiddleware(thunkMiddleware));
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);

        const renderedSources = TestUtils.scryRenderedComponentsWithType(result, Source);
        expect(renderedSources).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
    });

    it("should have spinner if isFetchingSources is true", () => {
        store = createStore(() => ({
            "currentSourceTab": currentTab,
            "sourceResults": { "data": [], "isFetchingSources": true },
            "sourceSearchKeyword": "Bla"
        }), applyMiddleware(thunkMiddleware));
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);

        const renderedSources = TestUtils.scryRenderedComponentsWithType(result, Spinner);
        expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
    });

    it("should display a search for source message if there are no sources and isFetching is false", () => {
        store = createStore(() => ({
            "currentSourceTab": currentTab,
            "sourceResults": { "data": [], "isFetchingSources": false },
            "sourceSearchKeyword": "Bla"
        }), applyMiddleware(thunkMiddleware));
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);
        const renderedDOM = ReactDOM.findDOMNode(result);
        const renderedParagraphs = renderedDOM.querySelectorAll("p");

        expect(renderedDOM.children.length).to.equal(1); // eslint-disable-line no-magic-numbers
        expect(renderedParagraphs.length).to.equal(1); // eslint-disable-line no-magic-numbers
        expect(renderedParagraphs[0].textContent).to.equal("Enter a keyword in the input box to get some sources"); // eslint-disable-line no-magic-numbers
    });

    xit("should have scroll event listener", () => {
        const rootDomNode = ReactDOM.findDOMNode(result);
        rootDomNode.scrollTop = 1500;
        TestUtils.Simulate.scroll(rootDomNode, {
            "target": rootDomNode
        });
    });
});
