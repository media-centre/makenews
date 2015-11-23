/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory } from "../../src/js/config/actions/CategoryActions.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import { displayAllCategoriesAsync } from "../../src/js/config/actions/AllCategoriesActions.js";
import mockStore from "../helper/ActionHelper.js";
import { expect } from "chai";
import sinon from "sinon";

describe("CategoryActions", () => {
    describe("populateCategoryDetails", () => {
        it("return type DISPLAY_CATEGORY action", function() {
            let sourceUrlsObj = { "rss": {}, "facebook": {}, "twitter": {} };
            expect(populateCategoryDetails(sourceUrlsObj)).to.deep.equal(
                                { "type": DISPLAY_CATEGORY, sourceUrlsObj });
        });
    });
});

describe("createCategory", () => {
    it("should dispatch displayAllCategoriesAsync after adding default category", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => { done(); }));
        CategoryDb.createCategoryIfNotExists.restore();
    });

    it("should not dispatch displayAllCategoriesAsync if adding default category fails", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.reject("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (error) => { done(); }));
        CategoryDb.createCategoryIfNotExists.restore();
    });
});
