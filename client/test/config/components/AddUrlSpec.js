/* eslint no-magic-numbers:0 */
 import AddUrl from "./../../../src/js/config/components/AddUrl";
 import * as AddUrlActions from "./../../../src/js/config/actions/AddUrlActions";
 import React from "react";
 import ReactDOM from "react-dom";
 import TestUtils from "react-addons-test-utils";
 import { applyMiddleware, createStore } from "redux";
 import thunkMiddleware from "redux-thunk";
 import { Provider } from "react-redux";
 import sinon from "sinon";
 import { expect } from "chai";
 describe("Add Url", () => {
     //let addUrlDom = null,
     let store = null;
     let sandbox = null;
     let addUrlDom = null;

     beforeEach("Add Url", () => {
         sandbox = sinon.sandbox.create();
         let message = "added";
         store = createStore(() => ({
             "addUrlMessage": message
         }), applyMiddleware(thunkMiddleware));
         addUrlDom = TestUtils.renderIntoDocument(<Provider store={store}><AddUrl /></Provider>);
     });

     afterEach("Add url", () => {
         sandbox.restore();
     });

     it("should wrap with the proper class name", () => {
         let addUrlClass = TestUtils.findRenderedDOMComponentWithClass(addUrlDom, "addurl").className;
         expect(addUrlClass).to.equal("addurl");
     });

     it("should dispatch addRSSUrl with url input ", () => {
         let addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").once().withArgs("http://www.test.com").returns({
             "type": ""
         });
         let addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
         let inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
         inputbox.value = "http://www.test.com";
         TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

         addRSSUrlMock.verify();
     });

     it("should dispatch invalid Rss Url if invalid url input ", () => {
         let invalidRssUrlMock = sandbox.mock(AddUrlActions).expects("invalidRssUrl").once().returns({
             "type": ""
         });
         let addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
         let inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
         inputbox.value = "test";
         TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

         invalidRssUrlMock.verify();
     });

     it("should not dispatch addRSSUrl if invalid url input ", () => {
         let addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
         let addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
         let inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
         inputbox.value = "test";
         TestUtils.Simulate.keyDown(inputbox, { "keyCode": 13 });

         addRSSUrlMock.verify();
     });

     it("should not dispatch addRSSUrl if the ENTER key is not pressed ", () => {
         let addRSSUrlMock = sandbox.mock(AddUrlActions).expects("addRssUrl").never();
         let addurlDOMNode = ReactDOM.findDOMNode(addUrlDom);
         let inputbox = addurlDOMNode.querySelectorAll(".addurlinput")[0];
         inputbox.value = "http://www.test.com";
         TestUtils.Simulate.keyDown(inputbox, { "keyCode": "a" });

         addRSSUrlMock.verify();
     });
 });

