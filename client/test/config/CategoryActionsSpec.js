/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory, createDefaultCategory } from "../../src/js/config/actions/CategoryActions.js";
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

describe("createDefaultCategory", () => {
    xit("should dispatch displayAllCategoriesAsync after adding category", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createDefaultCategory(categoryName), [displayAllCategoriesAsync()]);
        CategoryDb.createCategoryIfNotExists.restore();
    });

    xit("should not dispatch displayAllCategoriesAsync if adding category fails", (done) => {
        var categoryName = "default";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategoryIfNotExists").withArgs({
            "docType": "category",
            "name": categoryName
        });
        categoryDbStub.returns(Promise.reject("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createDefaultCategory(categoryName, (error) => { done(); }));
        CategoryDb.createCategoryIfNotExists.restore();
    });
});

describe("createCategory", () => {
    xit("should create category with given name", (done) => {
        var categoryName = "sports category";

        let categoryDbStub = sinon.stub(CategoryDb, "createCategory").withArgs({
            "docType": "category",
            "name": categoryName,
            "createdTime": new Date().getTime()
        });
        categoryDbStub.returns(Promise.resolve("document added"));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => { done(); }));
        CategoryDb.createCategory.restore();
    });

    xit("should auto-generate category name in order if name is empty", (done) => {
        let categoryName = "";
        let generatedCategoryName = "Untitled Category 1";

        let createCategoryMock = sinon.mock(CategoryDb).expects("createCategory");
        createCategoryMock.returns(Promise.resolve("document added"));

        let allCategoriesStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
        allCategoriesStub.returns(Promise.resolve([{id: "1", "name": "Default Category"}, {"id": "2", "name": "Sports"}]));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => { done(); }));
        createCategoryMock.verify();
        CategoryDb.createCategory.restore();
    });

    xit("should auto-generate category name with the minimal missing number", (done) => {
        let categoryName = "";
        let generatedCategoryName = "Untitled Category 2";

        let createCategoryMock = sinon.mock(CategoryDb).expects("createCategory");
        createCategoryMock.returns(Promise.resolve("document added"));

        let allCategoriesStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
        allCategoriesStub.returns(Promise.resolve([{id: "1", "name": "Untitled Category 1"}, {"id": "2", "name": "Untitled Category 3"}]));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => { done(); }));
        createCategoryMock.verify();
        CategoryDb.createCategory.restore();
    });
});
