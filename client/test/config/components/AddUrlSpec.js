//
// import AddUrl from "./../../../src/js/config/components/AddUrl";
// import * as AddUrlActions from "./../../../src/js/config/actions/AddUrlActions";
// import React from "react";
// import TestUtils from "react-addons-test-utils";
// import { applyMiddleware, createStore } from "redux";
// import thunkMiddleware from "redux-thunk";
// import { Provider } from "react-redux";
// import sinon from "sinon";
//
// describe("Add Url", () => {
//     let addUrlDom = null, store = null, sandbox = null;
//
//     beforeEach("Add Url", () => {
//         sandbox = sinon.sandbox.create();
//         let message = "some";
//         store = createStore(() => ({
//             "addUrlMessage": message
//         }), applyMiddleware(thunkMiddleware));
//
//         sandbox.mock(AddUrlActions).expects("addRssUrl").returns(
//             { "type": "something" }
//         );
//
//         addUrlDom = TestUtils.renderIntoDocument(<Provider store={store}><AddUrl /></Provider>);
//     });
//
//     it("should have help message", () => {
//         console.log(addUrlDom.props.children);
//     });
// });
//
