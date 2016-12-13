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

describe("Sources", () => {
    let sources = null, sandbox = null;
    let result = null, currentTab = null, store = null;

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
            "facebookCurrentSourceTab": currentTab,
            "facebookSources": sources,
            "hasMoreSourceResults": false
        }), applyMiddleware(thunkMiddleware));
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);

        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, Source);
        expect(renderedSources).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
    });

    it("should display a search for source message if there are no sources", () => {
        store = createStore(() => ({
            "facebookCurrentSourceTab": currentTab,
            "facebookSources": { "data": [] },
            "hasMoreSourceResults": false
        }), applyMiddleware(thunkMiddleware));
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);
        let renderedDOM = ReactDOM.findDOMNode(result);
        let renderedParagraphs = renderedDOM.querySelectorAll("p");

        expect(renderedDOM.children.length).to.equal(1); // eslint-disable-line no-magic-numbers
        expect(renderedParagraphs.length).to.equal(1); // eslint-disable-line no-magic-numbers
        expect(renderedParagraphs[0].textContent).to.equal("Enter a keyword in the input box to get some sources"); // eslint-disable-line no-magic-numbers
    });

    xit("should have scroll event listener", () => {
        var rootDomNode = ReactDOM.findDOMNode(result);
        rootDomNode.scrollTop = 1500;
        TestUtils.Simulate.scroll(rootDomNode, {
            "target": rootDomNode
        });
    });
});
