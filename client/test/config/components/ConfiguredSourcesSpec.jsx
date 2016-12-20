import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import ConfiguredSources from "./../../../src/js/config/components/ConfiguredSources";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { expect } from "chai";
import sinon from "sinon";

describe("Configured Sources", () => {

    describe("display configured sources", () => {

        it("should call configured source groups with twitter when current tab is twitter", () => {
            let store = createStore(() => ({
                "currentSourceTab": "TWITTER",
                "configuredSources": { "twitter": [{"name": "hello"}, {"name": "test"}]},
            }), applyMiddleware(thunkMiddleware));
            let ConfiguredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let ConfiguredSourcesDOM = ReactDOM.findDOMNode(ConfiguredSources);
            let inputBox = ConfiguredSourcesDOM.querySelectorAll(".source-name");
            expect(inputBox.length).to.equal(2);
        });
    });
});
