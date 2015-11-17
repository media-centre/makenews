/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";

import ConfigReducer, { allCategories, categoryDetails } from "../../src/js/config/reducers/ConfigReducer.js";
import { assert } from "chai";
import sinon from "sinon";
import { List } from "immutable";

describe("Config Reducer - allCategories", function() {
    it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = allCategories(undefined, action);
            assert.deepEqual({ "categories": List(["TimeLine"]) }, state);
        });

        it("should return categories in-case of DISPLAY_ALL_CATEGORIES", function() {
            let action = { "type": "DISPLAY_ALL_CATEGORIES" };
            let expectedState = { "categories": List(["TimeLine"], ["Sports"]) };
            let actualState = allCategories(expectedState, action);
            assert.strictEqual(expectedState.categories.length, actualState.categories.length);
            assert.strictEqual(expectedState.categories.get(0), actualState.categories.get(0));
            assert.strictEqual(expectedState.categories.get(1), actualState.categories.get(1));
        });

        it("should return categories in-case of DISPLAY_ALL_CATEGORIES without TimeLine", function() {
            let action = { "type": "DISPLAY_ALL_CATEGORIES", "categories": List(["Sports"])};
            let expectedState = { "categories": List(["Sports"]) };
            let actualState = allCategories(undefined, action);
            assert.strictEqual(actualState.categories.length , expectedState.categories.length + 1);
            assert.strictEqual(actualState.categories.get(0), expectedState.categories.get(0));
            assert.strictEqual(actualState.categories.get(1), "TimeLine");
        });
});

describe("Config Reducer - categoryDetails", function() {
    it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = allCategories(undefined, action);
            assert.deepEqual({ "categories": List(["TimeLine"]) }, state);
        });

        it("return default categoryConfig if document and categoryName are undefined", function() {
                let action = { "type": "DISPLAY_CATEGORY" };
                let expected = { "categoryName": "TimeLine", "sources": [{name: "RSS", details: []}, {name: "Facebook", details: []}, {name: "Twitter", details: []}] } ;
                assert.deepEqual(categoryDetails(undefined, action), expected);
                });

         it("return default categoryConfig if document and categoryName are null", function() {
                let action = { "type": "DISPLAY_CATEGORY","categoryDocument":null,"categoryName":"Sports" };
                let expected = { "categoryName": "Sports", "sources": [{name: "RSS", details: []}, {name: "Facebook", details: []}, {name: "Twitter", details: []}] } ;
                assert.deepEqual(categoryDetails(undefined, action), expected);
                });
        /*it("should return categories in-case of DISPLAY_CATEGORY", function() {
                    let action = { "type": "DISPLAY_CATEGORY", "categoryDocument": "myTest", "categoryName": "testName" };
                    let expectedState = {"categories": ["first", "second"]};
                    let mystub = sinon.stub(getCategoryState).withArgs("myTest", "testName").returns(expectedState);
//                    let expectation = sinon.expectation.create("getCategoryState").returns(expectedState);
                    //sinon.stub(getCategoryState).withArgs("myTest", "testName").returns(expectedState);
                    mystub.categoryDetails(undefined, action);
//                    assert.deepEqual(categoryDetails(undefined, action), expectedState);
                    expectation.verify();
                });*/
});