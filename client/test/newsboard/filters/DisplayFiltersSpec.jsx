import DisplayFilters from "../../../src/js/newsboard/filter/DisplayFilters";
import * as SourceConfigurationActions from "../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import * as FilterActions from "../../../src/js/newsboard/filter/FilterActions";
import SourceFilters from "../../../src/js/newsboard/filter/SourceFilters";
import Input from "../../../src/js/utils/components/Input";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import sinon from "sinon";
import { assert } from "chai";
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayFilters", () => {
    let displayFilters = null, displayFiltersDOM = null;
    const sandbox = sinon.sandbox.create();

    beforeEach("DisplayFilters", () => {
        let store = createStore(() => ({
            "configuredSources": { "web": [{ "_id": "id1", "name": "name1" },
                { "_id": "id2", "name": "name2" }],
                "pages": [], "profiles": [], "groups": [],
                "twitter": [] },
            "searchInConfiguredSources": "the",
            "currentFilter": "twitter",
            "currentFilterSource": { "web": [{ "_id": "id1", "name": "name1" }], "facebook": [], "twitter": [] }
        }), applyMiddleware(thunkMiddleware));

        const newsBoardStrings = {
            "filters": {
                "addHashTags": "ADD HASHTAG",
                "addTag": "ADD TAG",
                "cancelButton": "Cancel",
                "applyButton": "Apply",
                "hashTag": {
                    "alreadyExist": "Hashtag already exists",
                    "emptyHashTag": "Hashtag cannot be Empty"
                }
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "newsBoard": newsBoardStrings
            }
        });
        displayFilters = TestUtils.renderIntoDocument(
            <Provider store= {store}>
                <DisplayFilters dispatch={() => {}} callback={() => {}} />
            </Provider>);
        displayFiltersDOM = ReactDOM.findDOMNode(displayFilters);

    });

    afterEach("DisplayFilters", () => {
        sandbox.restore();
    });

    it("should have filters-container class with aside tag", () => {
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(displayFilters, "filters-container"));
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithTag(displayFilters, "aside"));
    });

    it("should have Input", () => {
        assert.isNotNull(TestUtils.findRenderedComponentWithType(displayFilters, Input));
    });

    it("should have SourceFilters", () => {
        assert.isNotNull(TestUtils.findRenderedComponentWithType(displayFilters, SourceFilters));
    });

    it("input box should visible after clicking on add-hashtag", () => {
        let hashtag = TestUtils.findRenderedDOMComponentWithClass(displayFilters, "add-hashtag");
        TestUtils.Simulate.click(hashtag);
        assert.isNotNull(TestUtils.findRenderedDOMComponentWithClass(displayFilters, "hashtag-box"));
    });

    it("should dispatch addSourceToConfigureList after clicking on input-tag", () => {
        let hashtag = TestUtils.findRenderedDOMComponentWithClass(displayFilters, "add-hashtag");
        TestUtils.Simulate.click(hashtag);
        let addToConfigureList = sandbox.mock(SourceConfigurationActions).expects("addSourceToConfigureList").returns({ "type": "" });
        let input = displayFiltersDOM.querySelectorAll(".input-tag")[1]; //eslint-disable-line no-magic-numbers
        input.value = "#hashtag";
        TestUtils.Simulate.keyUp(input, { "keyCode": 13 });
        addToConfigureList.verify();
    });

    it("should dispatch filterTabSwitch after clicking on cancel button", () => {
        let filterTabSwitchMock = sandbox.mock(FilterActions).expects("filterTabSwitch").returns({ "type": "" });
        let cancelButton = TestUtils.findRenderedDOMComponentWithClass(displayFilters, "cancel-btn secondary");
        TestUtils.Simulate.click(cancelButton);
        filterTabSwitchMock.verify();
    });

    it("should dispatch filterTabSwitch after clicking on apply button", () => {
        let filteredSources = sandbox.mock(FilterActions).expects("filteredSources").returns({ "type": "" });
        let filterTabSwitchMock = sandbox.mock(FilterActions).expects("filterTabSwitch").returns({ "type": "" });
        let applyButton = TestUtils.findRenderedDOMComponentWithClass(displayFilters, "apply-btn primary");
        TestUtils.Simulate.click(applyButton);
        filteredSources.verify();
        filterTabSwitchMock.verify();
    });

    it("should dispatch searchInSources after clicking on first child input tag", () => {
        let searchInSources = sandbox.mock(SourceConfigurationActions).expects("searchInConfiguredSources").returns({ "type": "" });
        let input = displayFiltersDOM.querySelectorAll(".input-tag")[0]; //eslint-disable-line no-magic-numbers
        input.value = "#hashtag";
        TestUtils.Simulate.keyUp(input, { "keyCode": 13 });
        searchInSources.verify();
    });

});
