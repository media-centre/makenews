/*eslint react/jsx-no-bind:0*/
import React from "react";
import { ConfigurePane } from "../../../src/js/config/components/ConfigurePane";
import ConfigPaneNavigation from "./../../../src/js/config/components/ConfigPaneNavigation";
import Input from "./../../../src/js/utils/components/Input";
import TestUtils from "react-addons-test-utils";
import { expect } from "chai";
import SourcePane from "../../../src/js/config/components/SourcePane";
import { findWithType } from "react-shallow-testutils";
import * as SourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import sinon from "sinon";
import { shallow } from "enzyme";
import History from "./../../../src/js/History";
import AppSessionStorage from "./../../../src/js/utils/AppSessionStorage";
import Locale from "./../../../src/js/utils/Locale";

describe("Configure Pane", () => {
    const sandbox = sinon.sandbox.create();

    beforeEach("Configure Pane", () => {
        const configurePage = {
            "header": {
                "mySources": "My Sources",
                "web": "Web URLs",
                "facebook": "Facebook",
                "twitter": "Twitter",
                "next": "Next",
                "done": "Done",
                "signIn": "Sign in"
            },
            "addAll": "Add All",
            "addCustomUrl": {
                "name": "Add custom url"
            },
            "warningMessages": {
                "configureAtLeastOneSource": "Please select at least one source either from Web Urls or Facebook or Twitter"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });
    });

    afterEach("Configure Pane", () => {
        sandbox.restore();
    });

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
            let navigationPane = findWithType(result, ConfigPaneNavigation);
            expect(navigationPane.props.currentSourceType).to.equal("web");
        });

        it("should have an Input component for searching sources", () => {
            let result = renderer.getRenderOutput();
            let input = findWithType(result, Input);
            expect(input.ref).to.equal("searchSources");
            expect(input.props.className).to.equal("input-box configure-source");
            expect(input.props.placeholder).to.equal("Search web....");
            expect(input.props.addonSrc).to.equal("search");
            expect(input.props.callbackOnEnter).to.equal(true);
        });

        it("should have SourcePane if there are sources", () => {
            renderer = TestUtils.createRenderer();
            configurePaneDOM = renderer.render(
                <ConfigurePane dispatch={dispatch} store={store} currentTab={currentTab}
                    sources = {{ "data": ["Hindu"] }} currentSourceType="web"
                />);
            let result = renderer.getRenderOutput();
            let renderedSource = findWithType(result, SourcePane);
            expect(renderedSource.props.dispatch).to.deep.equal(dispatch);
        });
    });

    describe("Configuration warning", () => {
        let wrapper = null;
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
            const appStore = AppSessionStorage.instance();
            sandbox.stub(AppSessionStorage, "instance").returns(appStore);

            wrapper = shallow(
                <ConfigurePane dispatch={dispatch} store={store}
                    currentTab={currentTab} sources = {{ "data": [] }}
                    searchKeyword = "search" currentSourceType="web"
                    configuredSources={{ "web": [{ "name": "web Url" }] }}
                />);

            const history = History.getHistory();
            sandbox.stub(History, "getHistory").returns(history);
            const historyPushMock = sandbox.mock(history).expects("push").withExactArgs("/newsBoard");
            const isFirstTimeUserMock = sandbox.mock(appStore).expects("remove")
                .withExactArgs(AppSessionStorage.KEYS.FIRST_TIME_USER)
                .returns(true);
            wrapper.instance().checkConfiguredSources();
            isFirstTimeUserMock.verify();
            historyPushMock.verify();
        });
    });
});
