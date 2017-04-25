import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import ConfiguredSources from "./../../../src/js/config/components/ConfiguredSources";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { expect } from "chai";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("Configured Sources", () => {
    const sandbox = sinon.sandbox.create();

    beforeEach("Configured Sources", () => {
        const configurePage = {
            "header": {
                "mySources": "My Sources"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });
    });

    afterEach("Configured Sources", () => {
        sandbox.restore();
    });

    describe("display configured sources", () => {
        it("should render twitter sources when the current source tab is TWITTER", () => {
            let store = createStore(() => ({
                "currentSourceTab": "twitter",
                "configuredSources": { "twitter": [{ "_id": "123", "name": "hello" }, { "_id": "1234", "name": "test" }] },
                "searchInConfiguredSources": ""
            }), applyMiddleware(thunkMiddleware));

            let configuredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let configuredSourcesDOM = ReactDOM.findDOMNode(configuredSources);
            let source = configuredSourcesDOM.querySelectorAll(".source-name");
            let sourcesHeading = configuredSourcesDOM.querySelector(".list-sources__group__heading");
            expect(sourcesHeading.textContent).to.equal("Twitter");
            expect(source.length).to.equal(2); //eslint-disable-line no-magic-numbers
        });
    });

    describe("search in rendered sources", () => {
        it("should return all matched sources of twitter with name matching the search key ", () => {
            let store = createStore(() => ({
                "currentSourceTab": "twitter",
                "configuredSources": { "twitter": [{ "_id": "123", "name": "hello" }, { "_id": "1234", "name": "test" }] },
                "searchInConfiguredSources": "hello"
            }), applyMiddleware(thunkMiddleware));
            let configuredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let configuredSourcesDOM = ReactDOM.findDOMNode(configuredSources);
            let source = configuredSourcesDOM.querySelectorAll(".source-name");
            expect(source.length).to.equal(1); //eslint-disable-line no-magic-numbers
        });

        it("should return all matched sources of web with name matching the search key ", () => {
            let store = createStore(() => ({
                "currentSourceTab": "web",
                "configuredSources": { "web": [{ "_id": "123", "name": "helloWeb" }, { "_id": "1234", "name": "test" }] },
                "searchInConfiguredSources": "hello"
            }), applyMiddleware(thunkMiddleware));

            let configuredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let configuredSourcesDOM = ReactDOM.findDOMNode(configuredSources);
            let source = configuredSourcesDOM.querySelectorAll(".source-name");
            expect(source.length).to.equal(1); //eslint-disable-line no-magic-numbers

        });

        it("should return all matched sources of facebook with name matching the search key ", () => {
            let store = createStore(() => ({
                "currentSourceTab": "pages",
                "configuredSources": { "pages": [{ "_id": "1235", "name": "helloFb" }, { "_id": "1236", "name": "test" }],
                    "groups": [{ "_id": "1237", "name": "helloFb" }, { "_id": "1238", "name": "test" }] },
                "searchInConfiguredSources": "hello"
            }), applyMiddleware(thunkMiddleware));

            let configuredSources = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfiguredSources />
                </Provider>
            );
            let configuredSourcesDOM = ReactDOM.findDOMNode(configuredSources);
            let source = configuredSourcesDOM.querySelectorAll(".source-name");
            expect(source.length).to.equal(2); //eslint-disable-line no-magic-numbers

        });
    });
});
