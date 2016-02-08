/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import SourceDb from "../../../src/js/config/db/SourceDb.js";
import Source from "../../../src/js/config/Source.js";
import Category from "../../../src/js/config/Category.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries";
import sinon from "sinon";
import { expect, assert } from "chai";

describe("CategoryDb", () => {
    describe("fetchAllCategoryDocuments", () => {
        it("should fetch all category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allCategories", { "include_docs": true }).returns(Promise.resolve(""));
            CategoryDb.fetchAllCategoryDocuments().then(() => {
                pouchClientMock.verify();
                PouchClient.fetchDocuments.restore();
                done();
            });
        });
    });

    describe("findById", () => {
        it("should return category for the id", (done) => {
            let categoryId = "categoryId";
            let categoryDoc = { "_id": categoryId, "name": "name", "createdTime": "132323423", "docType": "category" };
            let pouchClientMock = sinon.mock(PouchClient).expects("getDocument").withArgs().returns(Promise.resolve(categoryDoc));
            CategoryDb.findById(categoryId).then((resultDoc) => {
                assert.deepEqual(resultDoc.getDocument(), categoryDoc);
                pouchClientMock.verify();
                PouchClient.getDocument.restore();
                done();
            });
        });

        it("should reject with error if get fails", (done) => {
            let categoryId = "categoryId";
            let pouchClientMock = sinon.mock(PouchClient).expects("getDocument").withArgs().returns(Promise.reject("error"));
            CategoryDb.findById(categoryId).catch((error) => {
                assert.strictEqual(error, "error");
                pouchClientMock.verify();
                PouchClient.getDocument.restore();
                done();
            });
        });
    });
    
    describe("fetchAllCategories", () => {
        it("should fetch and resolve id and name of category documents", () => {
            let resultDocs = [
                {
                    "_id": "1",
                    "docType": "category",
                    "name": "Sports"
                },
                {
                    "_id": "2",
                    "docType": "category",
                    "name": "Politics"
                }
            ];
            let fetchAllCategoryDocumentsStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchAllCategoryDocumentsStub.returns(Promise.resolve(resultDocs));
            return CategoryDb.fetchAllCategories().then(categories => {
                let expectedCategories = [{ "_id": "1", "name": "Sports" }, { "_id": "2", "name": "Politics" }];
                expect(expectedCategories).to.deep.equal(categories);
                CategoryDb.fetchAllCategoryDocuments.restore();
            });
        });

        it("should reject with error if fetching category document fails", (done) => {
            let fetchAllCategoryDocumentsStub = sinon.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchAllCategoryDocumentsStub.returns(Promise.reject("error"));
            CategoryDb.fetchAllCategories().catch(error => {
                expect("error").to.eq(error);
                CategoryDb.fetchAllCategoryDocuments.restore();
                done();
            });
        });
    });

    describe("fetchCategoryByName", () => {
        it("should fetch the category by name", () => {
            let name = "categoryname";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allCategoriesByName", { "include_docs": true, "key": name });
            CategoryDb.fetchCategoryByName(name);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });

        it("should reject if the category name is empty", (done) => {
            CategoryDb.fetchCategoryByName("").catch(error => {
                expect("name should not be empty").to.equal(error);
                done();
            });
        });
    });

    describe("deleteCategory", ()=> {
        let sandbox = null, categoryGetMock = null, category = null, categoryDeleteMock = null, categoryDoc = null, categoryId = "categoryId";
        beforeEach("beforeEach", () => {
            categoryDoc = { "_id": "id", "name": "category name" };
            sandbox = sinon.sandbox.create();
            categoryGetMock = sandbox.mock(CategoryDb).expects("findById");
            category = new Category(categoryDoc);
            sandbox.stub(Category, "instance").withArgs(categoryDoc).returns(category);
            categoryDeleteMock = sandbox.mock(category).expects("delete");
        });

        afterEach("afterEach", () => {
            categoryGetMock.verify();
            categoryDeleteMock.verify();
            sandbox.restore();
        });

        it("should fetch category and delete", () => {
            categoryGetMock.withArgs(categoryId).returns(Promise.resolve(category));
            categoryDeleteMock.returns(Promise.resolve(true));
            return CategoryDb.deleteCategory(categoryId).then((response) => {
                assert.deepEqual(response, true);
            });
        });

        it("should reject with error if category fetch fails", () => {
            categoryGetMock.withArgs(categoryId).returns(Promise.reject("error"));
            categoryDeleteMock.never();
            return CategoryDb.deleteCategory(categoryId).catch((response) => {
                assert.strictEqual(response, "error");
            });
        });

        it("should reject with error if category delete fails", () => {
            categoryGetMock.withArgs(categoryId).returns(Promise.resolve(category));
            categoryDeleteMock.returns(Promise.reject("error"));
            return CategoryDb.deleteCategory(categoryId).catch((response) => {
                assert.strictEqual(response, "error");
            });
        });
    });
});
