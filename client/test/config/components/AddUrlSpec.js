/* eslint no-magic-numbers:0 */
import AddUrl from "./../../../src/js/config/components/AddUrl";
import * as AddUrlActions from "./../../../src/js/config/actions/AddUrlActions";
import Toast from "../../../src/js/utils/custom_templates/Toast";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import sinon from "sinon";
import { expect } from "chai";

describe("Add Url", () => {
    let store = null;
    let sandbox = null;
    let addUrlDom = null;

    beforeEach("Add Url", () => {
        sandbox = sinon.sandbox.create();
        const addUrlStatus = { "added": false };
        store = createStore(() => ({
            "addUrlMessage": addUrlStatus
        }), applyMiddleware(thunkMiddleware));
        addUrlDom = TestUtils.renderIntoDocument(<Provider store={store}><AddUrl /></Provider>);
    });

    afterEach("Add url", () => {
        sandbox.restore();
    });

    it("should wrap with the proper class name when there is no response message", () => {
        const addUrlClass = TestUtils.findRenderedDOMComponentWithClass(addUrlDom, "addurl").className;
        expect(addUrlClass).to.equal("addurl");
    });

    it("should dispatch addRSSUrl with url input ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").once()
            .withArgs("http://www.test.com").returns({ "type": "" });
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
        inputbox.value = "http://www.test.com";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        addRSSUrlMock.verify();
    });

    it("should show the Toast message if the url is invalid", () => {
        const toastMock = sandbox.mock(Toast).expects("show")
            .withExactArgs("Please enter proper url");
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
        inputbox.value = "test";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        toastMock.verify();
    });

    it("should not dispatch addRSSUrl if invalid url input ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
        inputbox.value = "test";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        addRSSUrlMock.verify();
    });

    it("should not dispatch addRSSUrl if the ENTER key is not pressed ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
        inputbox.value = "http://www.test.com";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": "a" });

        addRSSUrlMock.verify();
    });
});

