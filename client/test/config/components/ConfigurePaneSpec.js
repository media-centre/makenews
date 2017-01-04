import React from "react";
import ReactDOM from "react-dom";
import ConfigurePaneConnected, { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SourcePane from "../../../src/js/config/components/SourcePane";
import AddUrl from "../../../src/js/config/components/AddUrl";
import { findAllWithType, findWithClass } from "react-shallow-testutils";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import sinon from "sinon";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

describe("Configure Pane", () => {

    describe("config pane", () => {
        let store = null, renderer = null, configurePaneDOM = null, dispatch = null;
        let currentTab = null;

        beforeEach("Configure Pane", () => {
            dispatch = () => {};
            store = {
                "getState": ()=> {
                    return {
                        "currentSourceTab": "",
                        "sourceResults": {
                            "data": []
                        },
                        "hasMoreSourceResults": false
                    };
                }
            };
            currentTab = "Profiles";
            renderer = TestUtils.createRenderer();
            configurePaneDOM = renderer.render(
                <ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab} sources = {{ "data": [] }} searchKeyword = "search"/>
            );
        });

        it("wraps with a <div> with a proper class name", function() {
            expect(configurePaneDOM.type).to.equal("div");
            expect(configurePaneDOM.props.className).to.equal("configure-sources");
        });

        it("should have an input box for searching sources", () => {
            let result = renderer.getRenderOutput();
            let inputBox = findWithClass(result, "search-sources");

            expect(inputBox.type).to.equal("input");
            expect(inputBox.ref).to.equal("searchSources");
            expect(inputBox.props.type).to.equal("text");
            expect(inputBox.props.placeholder).to.equal(`Search ${currentTab}....`);
        });

        it("should have an addon search icon", () => {
            let result = renderer.getRenderOutput();
            let addon = findWithClass(result, "input-group__addon");
            expect(addon.type).to.equal("span");

            let img = addon.props.children;
            expect(img.props.src).to.equal("./images/search-icon.png");
        });

        it("should have AddUrl if there are no sources", () => {
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, AddUrl);
            expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
        });

        it("should have SourcePane if there are sources", () => {
            renderer = TestUtils.createRenderer();
            configurePaneDOM = renderer.render(<ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab} sources = {{ "data": ["Hindu"] }}/>);
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, SourcePane);
            expect(renderedSources).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
            expect(renderedSources[0].props.dispatch).to.deep.equal(dispatch); //eslint-disable-line no-magic-numbers
        });
    });

    describe("search input box", () => {
        let sandbox = null;
        let store = null, configurePane = null;
        let currentTab = null, getSourceMock = null;

        beforeEach("search input box", () => {
            currentTab = "Profiles";
            let addUrlStatus = { "message": "", "added": false };
            store = createStore(() => ({
                "currentSourceTab": currentTab,
                "sourceResults": { "data": [] },
                "hasMoreSourceResults": false,
                "sourceSearchKeyword": "something",
                "addUrlMessage": {}
            }), applyMiddleware(thunkMiddleware));

            sandbox = sinon.sandbox.create();
        });

        afterEach("search input box", () => {
            sandbox.restore();
        });

        it("should not dispatch if the enter key is not pressed", () => {
            getSourceMock = sandbox.mock(SourceConfigActions).expects("getSources")
                .never();

            configurePane = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfigurePaneConnected />
                </Provider>
            );

            let configurePaneDOM = ReactDOM.findDOMNode(configurePane);
            let inputBox = configurePaneDOM.querySelectorAll(".search-sources")[0]; //eslint-disable-line no-magic-numbers

            TestUtils.Simulate.keyUp(inputBox, { "key": "a" });

            getSourceMock.verify();
        });

        it("should not dispatch if there is no value in input box", () => {
            getSourceMock = sandbox.mock(SourceConfigActions).expects("getSources")
                .never();

            configurePane = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfigurePaneConnected />
                </Provider>
            );

            let configurePaneDOM = ReactDOM.findDOMNode(configurePane);
            let inputBox = configurePaneDOM.querySelectorAll(".search-sources")[0]; //eslint-disable-line no-magic-numbers

            TestUtils.Simulate.keyUp(inputBox, { "keyCode": 13 });

            getSourceMock.verify();
        });

        it("should dispatch the getSources with the search value", () => {
            getSourceMock = sandbox.mock(SourceConfigActions).expects("getSources")
                .once().withArgs(currentTab).returns({
                    "type": ""
                });

            configurePane = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConfigurePaneConnected />
                </Provider>
            );

            let configurePaneDOM = ReactDOM.findDOMNode(configurePane);
            let inputBox = configurePaneDOM.querySelectorAll(".search-sources")[0]; //eslint-disable-line no-magic-numbers

            inputBox.value = "something";
            TestUtils.Simulate.keyUp(inputBox, { "keyCode": 13 });

            getSourceMock.verify();
        });
    });
});
