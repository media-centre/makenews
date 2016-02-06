/*eslint max-nested-callbacks:0, no-unused-vars:0 */
"use strict";
import PouchClient from "../../src/js/db/PouchClient.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import Category from "../../src/js/config/Category.js";
import sinon from "sinon";
import { assert } from "chai";

describe("Category", () => {
    let sandbox = null;
    beforeEach("before each", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("after each", () => {
        sandbox.restore();
    });

    describe("getDocument", () => {
        it("should return the object with createdDate if it is not present", () => {
            let document = {
                "docType": "category",
                "name": "b"
            };
            let category = Category.instance(document);
            let categoryDocument = category.getDocument();
            assert.strictEqual(categoryDocument.docType, "category");
            assert.strictEqual(categoryDocument.name, "b");
            assert.deepEqual(["docType", "name", "createdTime"], Object.keys(categoryDocument));
            assert.strictEqual(new Date().getDate(), new Date(categoryDocument.createdTime).getDate());
        });

        it("should return the object with _id and _rev is passed", () => {
            let document = {
                "_id": "id",
                "_rev": "rev",
                "docType": "category",
                "name": "b",
                "createdTime": new Date("01 Jan 2016").getTime()
            };
            let category = Category.instance(document);
            let categoryDocument = category.getDocument();
            assert.strictEqual(categoryDocument._id, "id");
            assert.strictEqual(categoryDocument._rev, "rev");
            assert.strictEqual(1, new Date(categoryDocument.createdTime).getDate());
        });
    });

    describe("save", () => {
        let document = null, fetchCategoryByNameStub = null;
        beforeEach("before", () => {
            document = {
                "docType": "category",
                "name": "b"
            };
            fetchCategoryByNameStub = sandbox.stub(CategoryDb, "fetchCategoryByName");
        });

        it("should create the category document", (done) => {
            let category = Category.instance(document);
            fetchCategoryByNameStub.returns(Promise.resolve([]));
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").withArgs(category.getDocument()).returns(Promise.resolve("resolve"));
            category.save().then((savedResult) => {
                pouchClientMock.verify();
                assert.strictEqual(savedResult.name, "b");
                done();
            });
        });

        it("should generate name if name is not present", (done) => {
            document = {};
            let allCategoriesStub = sandbox.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchCategoryByNameStub.returns(Promise.resolve([]));
            allCategoriesStub.returns(Promise.resolve([{ "id": "1", "name": "Default Category" }, { "id": "2", "name": "Sports" }]));
            let category = Category.instance(document);
            let categoryDocument = category.getDocument();
            categoryDocument.name = "Untitled Category 1";
            let categoryDocumentWithName = categoryDocument;
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").withArgs(categoryDocumentWithName).returns(Promise.resolve({ "ok": true, "id": "id", "rev": "rev" }));
            category.save().then((savedResult) => {
                assert.strictEqual(savedResult.name, "Untitled Category 1");
                pouchClientMock.verify();
                done();
            });
        });

        it("should auto-generate category name with the minimal missing number", (done) => {
            document = {};
            let allCategoriesStub = sandbox.stub(CategoryDb, "fetchAllCategoryDocuments");
            fetchCategoryByNameStub.returns(Promise.resolve([]));
            allCategoriesStub.returns(Promise.resolve([{ "id": "1", "name": "Untitled Category 1" }, { "id": "2", "name": "Untitled Category 3" }]));
            let category = Category.instance(document);
            let categoryDocument = category.getDocument();
            categoryDocument.name = "Untitled Category 2";
            let categoryDocumentWithName = categoryDocument;
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").withArgs(categoryDocumentWithName).returns(Promise.resolve({ "ok": true, "id": "id", "rev": "rev" }));
            category.save().then((savedResult) => {
                assert.strictEqual(savedResult.name, "Untitled Category 2");
                pouchClientMock.verify();
                done();
            });
        });

        it("should not create the category document if name exists already", (done) => {
            let category = Category.instance(document);
            fetchCategoryByNameStub.returns(Promise.resolve([{ "name": "b" }]));
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").never();
            category.save().catch((savedResult) => {
                pouchClientMock.verify();
                done();
            });
        });

        it("should not create the category document if fetchCategoryByName fails", (done) => {
            let category = Category.instance(document);
            fetchCategoryByNameStub.returns(Promise.reject(""));
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").never();
            category.save().catch((savedResult) => {
                pouchClientMock.verify();
                done();
            });
        });

        it("should resolve with error if create fails", (done) => {
            let category = Category.instance(document);
            fetchCategoryByNameStub.returns(Promise.resolve([]));
            let pouchClientMock = sandbox.mock(PouchClient).expects("createDocument").withExactArgs(category.getDocument()).returns(Promise.reject("error"));
            category.save().catch(() => {
                pouchClientMock.verify();
                done();
            });
        });
    });
});

