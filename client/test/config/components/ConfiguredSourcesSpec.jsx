import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import ConfiguredSources from "./../../../src/js/config/components/ConfiguredSources";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { expect } from "chai";

describe("Configured Sources", () => {

    describe("display configured sources", () => {
        it("should render twitter sources when the current source tab is TWITTER", () => {
            let store = createStore(() => ({
                "currentSourceTab": "TWITTER",
                "configuredSources": { "twitter": [{ "name": "hello" }, { "name": "test" }] }
            }), applyMiddleware(thunkMiddleware));

            let configuredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let configuredSourcesDOM = ReactDOM.findDOMNode(configuredSources);
            let source = configuredSourcesDOM.querySelectorAll(".source-name");
            let sourcesHeading = configuredSourcesDOM.querySelector(".configured-sources__group__heading");
            expect(sourcesHeading.textContent).to.equal("Twitter");
            expect(source.length).to.equal(2); //eslint-disable-line no-magic-numbers
        });
    });
});
