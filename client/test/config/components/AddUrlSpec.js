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
import { WEB, TWITTER } from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { PAGES } from "./../../../src/js/config/actions/FacebookConfigureActions";
import { mount } from "enzyme";
import Locale from "./../../../src/js/utils/Locale";

describe("Add Url", () => {
    let store = null;
    let sandbox = null;
    let addUrlDom = null;

    beforeEach("Add Url", () => {
        sandbox = sinon.sandbox.create();
        const configurePage = {
            "header": {},
            "addCustomUrl": {
                "name": "Add custom url",
                "description": {
                    "web": "Please enter the link below to add a new web source.",
                    "pages": "Please enter the link below to add a new page source.",
                    "twitter": "Please enter the link below to add a new twitter source."
                },
                "exampleUrls": {
                    "web": "http://economictimes.indiatimes.com/rssfeedsdefault.cms",
                    "pages": "https://www.facebook.com/TimesofIndia",
                    "twitter": "@timesofindia"
                },
                "messages": {
                    "validateUrl": "Please enter proper url",
                    "success": "Added Successfully"
                }
            }
        };

        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "configurePage": configurePage
            }
        });

        store = createStore(() => ({
            "currentSourceTab": WEB
        }), applyMiddleware(thunkMiddleware));
        addUrlDom = TestUtils.renderIntoDocument(<Provider store={store}><AddUrl /></Provider>);
    });

    afterEach("Add url", () => {
        sandbox.restore();
    });

    it("should wrap with the proper class name when there is no response message", () => {
        const addUrlClass = TestUtils.findRenderedDOMComponentWithClass(addUrlDom, "add-url").className;
        expect(addUrlClass).to.equal("add-url");
    });

    it("should dispatch addRSSUrl with url input ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").once()
            .withArgs("http://www.test.com").returns({ "type": "" });
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".add-url__input")[0];
        inputbox.value = "http://www.test.com";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        addRSSUrlMock.verify();
    });

    it("should show the Toast message if the url is invalid", () => {
        const toastMock = sandbox.mock(Toast).expects("show")
            .withExactArgs("Please enter proper url");
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".add-url__input")[0];
        inputbox.value = "test";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        toastMock.verify();
    });

    it("should not dispatch addRSSUrl if invalid url input ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".add-url__input")[0];
        inputbox.value = "test";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

        addRSSUrlMock.verify();
    });

    it("should not dispatch addRSSUrl if the ENTER key is not pressed ", () => {
        const addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
        const addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
        const inputbox = addurlDOMNode.querySelectorAll(".add-url__input")[0];
        inputbox.value = "http://www.test.com";
        TestUtils.Simulate.keyDown(inputbox, { "keyCode": "a" });

        addRSSUrlMock.verify();
    });

    it("should dispatch showAddUrl false when we click on close icon", () => {
        const dispatchSpy = sandbox.spy();
        const showAddUrl = sandbox.spy();
        sandbox.stub(AddUrlActions, "showAddUrl").returns(showAddUrl);

        store = {
            "getState": () => ({
                "currentSourceTab": PAGES
            }),
            "dispatch": dispatchSpy,
            "subscribe": () => {}
        };

        addUrlDom = mount(<AddUrl dispatch={dispatchSpy} store={store}/>);

        const closeBtn = addUrlDom.find(".close");
        closeBtn.node.value = "https://www.facebook.com/test";
        closeBtn.simulate("click");

        expect(dispatchSpy.calledWith(showAddUrl)).to.be.true; //eslint-disable-line no-unused-expressions
    });

    it("should dispatch addFacebookPage if source tab is pages and we try to add url", () => {
        const dispatchSpy = sandbox.spy();
        const addFacebookPageSpy = sandbox.spy();
        sandbox.stub(AddUrlActions, "addFacebookPage").returns(addFacebookPageSpy);

        store = {
            "getState": () => ({
                "currentSourceTab": PAGES
            }),
            "dispatch": dispatchSpy,
            "subscribe": () => {}
        };

        addUrlDom = mount(<AddUrl dispatch={dispatchSpy} store={store}/>);

        const input = addUrlDom.find(".add-url__input");
        input.node.value = "https://www.facebook.com/test";
        input.simulate("keyDown", { "keyCode": 13 });

        expect(dispatchSpy.calledWith(addFacebookPageSpy)).to.be.true; //eslint-disable-line no-unused-expressions
    });

    it("should dispatch addTwitterHandle if source tab is twitter and we try to add url", () => {
        const dispatchSpy = sandbox.spy();
        const addTwitterHandleSpy = sandbox.spy();
        sandbox.stub(AddUrlActions, "addTwitterHandle").returns(addTwitterHandleSpy);

        store = {
            "getState": () => ({
                "currentSourceTab": TWITTER
            }),
            "dispatch": dispatchSpy,
            "subscribe": () => {}
        };

        addUrlDom = mount(<AddUrl dispatch={dispatchSpy} store={store}/>);

        const input = addUrlDom.find("input.add-url__input");
        input.node.value = "@test";
        input.simulate("keyDown", { "keyCode": 13 });

        expect(dispatchSpy.calledWith(addTwitterHandleSpy)).to.be.true; //eslint-disable-line no-unused-expressions
    });
});

