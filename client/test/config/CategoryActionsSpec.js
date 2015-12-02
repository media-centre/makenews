/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY, createCategory, createDefaultCategory, addRssUrlAsync } from "../../src/js/config/actions/CategoryActions.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import CategoriesApplicationQueries from "../../src/js/config/db/CategoriesApplicationQueries";
import { displayAllCategoriesAsync } from "../../src/js/config/actions/AllCategoriesActions.js";
import { STATUS_INVALID } from "../../src/js/config/actions/CategoryDocuments.js";
import AjaxClient from "../../src/js/utils/AjaxClient";
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

describe("addRssUrlAsync", () => {
    let sandbox = null, categorySourceConfig = null, ajaxGetMock = null, ajaxInstanceMock = null;

    beforeEach("Before", () => {
        sandbox = sinon.sandbox.create();
        let ajaxMock = new AjaxClient("/rss-feeds");
        ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/rss-feeds").returns(ajaxMock);
        ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
    });

    before("Before", () => {
        categorySourceConfig = {
            "sources": {
                "rss": { "name": "RSS", "details": [] },
                "facebook": { "name": "Facebook", "details": [] },
                "twitter": { "name": "Twitter", "details": [] }
            }
        };
    });

    it("should create rss and dispatch populateCategoryDetailsAsync", (done) => {
        let categoryId = "categoryId";
        let url = "www.hindu.com";
        let allSources = [{ "url": url, "docType": "sources" }];
        
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve({ "data": "feeds" }));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let categoriesApplicationQueriesMock = sandbox.mock(CategoriesApplicationQueries).expects("addRssUrlConfiguration");
        categoriesApplicationQueriesMock.withArgs(categoryId, url).returns(Promise.resolve("response"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url))).then(() => {
            categoriesApplicationQueriesMock.verify();
        });
    });

    it("should not create rss if the url fetch returns invalid response", () => {
        let categoryId = "categoryId";
        let url = "www.hindu.com";
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));
        let categoriesApplicationQueriesMock = sandbox.mock(CategoriesApplicationQueries).expects("addRssUrlConfiguration").never();
        const store = mockStore(categorySourceConfig, []);
        store.dispatch(addRssUrlAsync(categoryId, url));
        categoriesApplicationQueriesMock.verify();
    });

    it("should create rss with valid status on successful fetch", (done) => {
        let categoryId = "categoryId";
        let url = "www.hindu.com";
        let allSources = [{ "url": url, "docType": "sources" }];
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.resolve({ "data": "feeds" }));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));
        let categoriesApplicationQueriesMock = sandbox.mock(CategoriesApplicationQueries).expects("addRssUrlConfiguration");
        categoriesApplicationQueriesMock.withArgs(categoryId, url, "valid").returns(Promise.resolve("response"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url))).then(() => {
            categoriesApplicationQueriesMock.verify();
        });
    });

    it("should create rss with invalid status if url is invalid", (done) => {
        let categoryId = "categoryId";
        let url = "www.hindu.com";
        let allSources = [{ "url": url, "docType": "sources" }];
        ajaxGetMock.withArgs({ "url": url }).returns(Promise.reject("error"));

        sandbox.stub(CategoriesApplicationQueries, "fetchSourceUrlsObj").withArgs(categoryId).returns(Promise.resolve(allSources));

        let categoriesApplicationQueriesMock = sandbox.mock(CategoriesApplicationQueries).expects("addRssUrlConfiguration");
        categoriesApplicationQueriesMock.withArgs(categoryId, url, STATUS_INVALID).returns(Promise.resolve("response"));

        let expectedActions = [{ "type": DISPLAY_CATEGORY, "sourceUrlsObj": allSources }];
        const store = mockStore(categorySourceConfig, expectedActions, done);
        return Promise.resolve(store.dispatch(addRssUrlAsync(categoryId, url))).then(() => {
            categoriesApplicationQueriesMock.verify();
        });
    });

    afterEach("After", () => {
        ajaxInstanceMock.verify();
        ajaxGetMock.verify();
        sandbox.restore();
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
        allCategoriesStub.returns(Promise.resolve([{ id: "1", "name": "Default Category" }, { "id": "2", "name": "Sports" }]));
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
        allCategoriesStub.returns(Promise.resolve([{ id: "1", "name": "Untitled Category 1" }, { "id": "2", "name": "Untitled Category 3" }]));
        const store = mockStore({}, [], done);
        store.dispatch(createCategory(categoryName, (success) => { done(); }));
        createCategoryMock.verify();
        CategoryDb.createCategory.restore();
    });
});
