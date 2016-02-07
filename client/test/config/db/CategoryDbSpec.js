/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import SourceDb from "../../../src/js/config/db/SourceDb.js";
import Source from "../../../src/js/config/Source.js";
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
        let sandbox = sinon.sandbox.create();
        afterEach("afterEach", () => {
            sandbox.restore();
        });
        it("should fetch all urls and call delete of all urls", (done)=> {
            let categoryId = 123, fourTimes = 4;
            let urlDocs = [{ "_id": "101", "url": "@icc" }, { "_id": "102", "url": "@xyz" },
                { "_id": "103", "url": "http://facebook.com/test1" },
                { "_id": "104", "url": "http://test.com/rss" }];
            let categoryDoc = {
                "_id": "06E26F38-1145-B850-AFE0-072537EDBC98",
                "_rev": "24-4f80c047d21a5cd55bdae898eaa7f912",
                "docType": "category",
                "name": "Ull",
                "createdTime": 1451373861028
            };
            let pouchClientMock = sandbox.mock(PouchClient);
            pouchClientMock.expects("getDocument").withArgs(categoryId).returns(Promise.resolve(categoryDoc));
            pouchClientMock.expects("deleteDocument").withArgs(categoryDoc).returns(Promise.resolve(true));
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.resolve(urlDocs));
            let source = new Source({});
            sandbox.stub(Source, "instance").returns(source);
            let deleteSourceUrlMock = sandbox.mock(source).expects("delete").withArgs(categoryId).atMost(fourTimes).returns(Promise.resolve("response"));
            CategoryDb.deleteCategory(categoryId).then((message)=> {
                fetchUrlsMock.verify();
                deleteSourceUrlMock.verify();
                pouchClientMock.verify();
                done();
            });
        });
    });
});
