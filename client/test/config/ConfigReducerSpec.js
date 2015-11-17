/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { allCategories, categoryDetails } from "../../src/js/config/reducers/ConfigReducer.js";
import { expect } from "chai";
import { List } from "immutable";

describe("Config Reducer", () => {
    describe("allCategories", () => {
        it("default state if action type is not handled", () => {
            let action = { "type": "undefined" };
            let state = allCategories(undefined, action);
            expect({ "categories": new List(["TimeLine"]) }).to.deep.equal(state);
        });

        it("should not include the TimeLine twice in the state if it is already exists in parameters", () => {
            let action = { "type": "DISPLAY_ALL_CATEGORIES", "categories": ["TimeLine", "Sports"] };
            let expectedState = { "categories": ["TimeLine", "Sports"] };
            let actualState = allCategories(null, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.equal(expectedState.categories[0]);
            expect(actualState.categories.get(1)).to.equal(expectedState.categories[1]);
        });

        it("should include the TimeLine category by default in the state", () => {
            let action = { "type": "DISPLAY_ALL_CATEGORIES", "categories": ["Sports"] };
            let expectedState = { "categories": ["Sports", "TimeLine"] };
            let actualState = allCategories(undefined, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.equal(expectedState.categories[0]);
            expect(actualState.categories.get(1)).to.equal(expectedState.categories[1]);

        });
    });

    describe("categoryDetails", () => {
        it("default state if action type is not handled", () => {
            let state = allCategories(undefined);
            expect({ "categories": new List(["TimeLine"]) }).to.deep.equal(state);
        });

        it("return default categoryConfig if document and categoryName are undefined", () => {
            let action = { "type": "DISPLAY_CATEGORY" };
            let expected = { "categoryName": "TimeLine", "sources": [{ "name": "RSS", "details": [] },
                { "name": "Facebook", "details": [] }, { "name": "Twitter", "details": [] }] };
            expect(categoryDetails(undefined, action)).to.deep.equal(expected);
        });

        it("return default categoryConfig if document and categoryName are null", () => {
            let action = { "type": "DISPLAY_CATEGORY", "categoryDocument": null, "categoryName": "Sports" };
            let expected = { "categoryName": "Sports", "sources": [{ "name": "RSS", "details": [] },
                { "name": "Facebook", "details": [] }, { "name": "Twitter", "details": [] }] };
            expect(categoryDetails(undefined, action)).to.deep.equal(expected);
        });

        xit("should return categories in-case of DISPLAY_CATEGORY", () => {
         let action = { "type": "DISPLAY_CATEGORY", "categoryDocument": "myTest", "categoryName": "testName" };
         let expectedState = {"categories": ["first", "second"]};
         let mystub = sinon.stub(getCategoryState).withArgs("myTest", "testName").returns(expectedState);
         //                    let expectation = sinon.expectation.create("getCategoryState").returns(expectedState);
         //sinon.stub(getCategoryState).withArgs("myTest", "testName").returns(expectedState);
         mystub.categoryDetails(undefined, action);
         //                    assert.deepEqual(categoryDetails(undefined, action), expectedState);
         expectation.verify();
         });
    });

});