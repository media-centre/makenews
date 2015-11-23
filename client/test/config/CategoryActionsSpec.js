/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory } from "../../src/js/config/actions/CategoryActions.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import { displayAllCategoriesAsync } from "../../src/js/config/actions/AllCategoriesActions.js";
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
    let dispatch = null;
    beforeEach("createCategory", () => {
        dispatch = sinon.spy();
    });
    afterEach("createCategory", () => {
    });
    xit("should dispatch displayAllCategoriesAsync after adding default category", () => {
        var categoryName = "default";

        //CategoryDb.createCategoryIfNotExists
        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        createCategory(categoryName)(dispatch);
        dispatch.withArgs(displayAllCategoriesAsync());
    });

    xit("should not dispatch displayAllCategoriesAsync if adding default category fails", () => {
        var categoryName = "default";

        //CategoryDb.createCategoryIfNotExists
        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        createCategory(categoryName)(dispatch);
        dispatch.withArgs(displayAllCategoriesAsync());
    });

    xit("should dispatch login failure action if the login is not successful", () => {
    });
})
