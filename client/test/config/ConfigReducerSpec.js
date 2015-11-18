/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { allCategories, categoryDetails } from "../../src/js/config/reducers/ConfigReducer.js";
import { DISPLAY_ALL_CATEGORIES } from "../../src/js/config/actions/AllCategoriesActions.js";
import { DISPLAY_CATEGORY } from "../../src/js/config/actions/CategoryActions.js";
import { expect } from "chai";
import { List } from "immutable";

describe("Config Reducer", () => {
    describe("allCategories", () => {
        it("default state should return default category", () => {
            expect({ "categories": new List(["TimeLine"]) }).to.deep.equal(allCategories());
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
            let action = { "type": DISPLAY_ALL_CATEGORIES, "categories": ["Sports"] };
            let expectedState = { "categories": ["Sports", "TimeLine"] };
            let actualState = allCategories(undefined, action);
            expect(actualState.categories.size).to.equal(expectedState.categories.length);
            expect(actualState.categories.get(0)).to.equal(expectedState.categories[0]);
            expect(actualState.categories.get(1)).to.equal(expectedState.categories[1]);

        });
    });

    describe("categoryDetails", () => {
        it("default state if action type is not handled", () => {
            expect({ "categories": new List(["TimeLine"]) }).to.deep.equal(allCategories());
        });

        it("return default categoryConfig if document and categoryName are undefined", () => {
            let action = { "type": DISPLAY_CATEGORY };
            let expected = { "categoryName": "TimeLine", "sources": [{ "name": "RSS", "details": [] },
                { "name": "Facebook", "details": [] }, { "name": "Twitter", "details": [] }] };
            expect(categoryDetails(undefined, action)).to.deep.equal(expected);
        });

        it("return default categoryConfig if document and categoryName are null", () => {
            let action = { "type": DISPLAY_CATEGORY, "categoryDocument": null, "categoryName": null };
            let expected = { "categoryName": "TimeLine", "sources": [{ "name": "RSS", "details": [] },
                { "name": "Facebook", "details": [] }, { "name": "Twitter", "details": [] }] };
            expect(categoryDetails(undefined, action)).to.deep.equal(expected);
        });

        it("return categoryConfig from categoryDocument", () => {
            let categoryDocument = { "name": "Sports",
                                "rssFeeds": { "rss1": "true", "rss2": "true" },
                                "faceBookFeeds": { "fb1": "true", "fb2": "true" },
                                 "twitterFeeds": { "tw1": "true", "tw2": "true" }
                                 };
            let action = { "type": DISPLAY_CATEGORY,
                        "categoryDocument": categoryDocument,
                        "categoryName": "Sports" };

            let expectedState = { "categoryName": "Sports",
                                "sources": [{ "name": "RSS",
                                            "details": ["rss1", "rss2"] },
                                            { "name": "Facebook",
                                            "details": ["fb1", "fb2"] },
                                            { "name": "Twitter",
                                            "details": ["tw1", "tw2"] }] };
            expect(categoryDetails(undefined, action)).to.deep.equal(expectedState);
        });
    });

});