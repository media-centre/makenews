import React from "react";
import ReactDOM from "react-dom";
import ConfigurePaneConnected, { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import ConfigPaneNavigation from "./../../../src/js/config/components/ConfigPaneNavigation";
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
import { shallow } from "enzyme";
import History from "./../../../src/js/History";

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
                        }
                    };
                }
            };
            currentTab = SourceConfigActions.WEB;
            renderer = TestUtils.createRenderer();
            configurePaneDOM = renderer.render(
                <ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab} sources = {{ "data": [] }} searchKeyword = "search" currentSourceType="web"/>
            );
        });

        it("wraps with a <div> with a proper class name", function() {
            expect(configurePaneDOM.type).to.equal("div");
            expect(configurePaneDOM.props.className).to.equal("configure-sources");
        });

        it("should have ConfigPaneNavigationComponent", () => {
            let result = renderer.getRenderOutput();
            let renderedSources = findAllWithType(result, ConfigPaneNavigation);
            expect(renderedSources).to.have.lengthOf(1);  //eslint-disable-line no-magic-numbers
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
            const result = renderer.getRenderOutput();
            const addon = findWithClass(result, "input-addon");
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
            configurePaneDOM = renderer.render(
                <ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab}
                    sources = {{ "data": ["Hindu"] }} currentSourceType="web"
                />);
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
            store = createStore(() => ({
                "currentSourceTab": currentTab,
                "sourceResults": { "data": [] },
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
                    <ConfigurePaneConnected currentSourceType="web"/>
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
                    <ConfigurePaneConnected currentSourceType="web" />
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
                    <ConfigurePaneConnected currentSourceType="web" />
                </Provider>
            );

            let configurePaneDOM = ReactDOM.findDOMNode(configurePane);
            let inputBox = configurePaneDOM.querySelectorAll(".search-sources")[0]; //eslint-disable-line no-magic-numbers

            inputBox.value = "something";
            TestUtils.Simulate.keyUp(inputBox, { "keyCode": 13 });

            getSourceMock.verify();
        });
    });

    describe("Configuration warning", () => {
        let wrapper = null;
        const sandbox = sinon.sandbox.create();
        const dispatch = () => {};
        const store = {
            "getState": ()=> {
                return {
                    "currentSourceTab": "",
                    "sourceResults": {
                        "data": []
                    }
                };
            }
        };
        const currentTab = SourceConfigActions.WEB;
        beforeEach("Configuration warning", () => {
            wrapper = shallow(
                <ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab} sources = {{ "data": [] }} searchKeyword = "search" currentSourceType="web"/>);
        });

        afterEach("Configuration warning", () => {
            sandbox.restore();
        });

        it("should have a configuration warning with three children", () => {
            wrapper.setState({ "showConfigurationWarning": true });
            const configWarn = wrapper.find(".configuration-warning");
            expect(configWarn.node.type).to.equals("div");
            expect(configWarn.node.props.children).to.have.lengthOf(3);//eslint-disable-line no-magic-numbers
        });

        it("should have a configuration warning icon with class name warning-icon", () => {
            wrapper.setState({ "showConfigurationWarning": true });
            const configWarn = wrapper.find(".configuration-warning");
            const [warnIcon] = configWarn.node.props.children;
            expect(warnIcon.type).to.equals("i");
            expect(warnIcon.props.className).to.equals("warning-icon");
        });

        it("should have a configuration warning message with class name warning-message", () => {
            wrapper.setState({ "showConfigurationWarning": true });
            const configWarn = wrapper.find(".configuration-warning");
            const [, warnMessage] = configWarn.node.props.children;
            expect(warnMessage.type).to.equals("span");
            expect(warnMessage.props.children).to.equals("Please select at least one source either from Web Urls or Facebook or Twitter");
        });

        it("should have a configuration warning message with class name warning-message", () => {
            wrapper.setState({ "showConfigurationWarning": true });
            const configWarn = wrapper.find(".configuration-warning");
            const [,, close] = configWarn.node.props.children;
            expect(close.type).to.equals("span");
            expect(close.props.children).to.equals("×");
        });

        it("should have a configuration warning message with class name warning-message", () => {
            wrapper.setState({ "showConfigurationWarning": true });
            const configWarn = wrapper.find(".configuration-warning");
            configWarn.find(".close").simulate("click");
            expect(wrapper.state().showConfigurationWarning).to.be.false; //eslint-disable-line no-unused-expressions
        });

        it("should show the warning messages if no configured sources are there", () => {
            wrapper.instance().checkConfiguredSources();

            expect(wrapper.state().showConfigurationWarning).to.be.true; //eslint-disable-line no-unused-expressions
        });

        it("should go to /newsBoard page if it has configured sources", () => {
            wrapper = shallow(
                <ConfigurePane dispatch={dispatch} store={store}
                    currentTab={currentTab} sources = {{ "data": [] }}
                    searchKeyword = "search" currentSourceType="web"
                    configuredSources={{ "web": [{ "name": "web Url" }] }}
                />);
            const history = History.getHistory();
            sandbox.stub(History, "getHistory").returns(history);
            const historyPushMock = sandbox.mock(history).expects("push").withExactArgs("/newsBoard");

            wrapper.instance().checkConfiguredSources();

            historyPushMock.verify();
        });

    });
});
