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

        store = createStore(() => ({
            "facebookCurrentSourceTab": currentTab,
            "facebookSources": sources,
            "hasMoreSourceResults": false
        }), applyMiddleware(thunkMiddleware));

        sandbox = sinon.sandbox.create();
        result = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Sources />
            </Provider>);
    });

    afterEach("SourcePane", () => {
        sandbox.restore();
    });

    it("should render Sources", () => {
        let renderedSources = TestUtils.scryRenderedComponentsWithType(result, Source);
        expect(renderedSources).to.have.lengthOf(2); //eslint-disable-line no-magic-numbers
    });

    xit("should have scroll event listener", () => {
        var rootDomNode = ReactDOM.findDOMNode(result);
        rootDomNode.scrollTop = 1500;
        TestUtils.Simulate.scroll(rootDomNode, {
            "target": rootDomNode
        });
    });
});
