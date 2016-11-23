/*eslint max-nested-callbacks:0, no-unused-vars:0 */
import PouchClient from "../../src/js/db/PouchClient";
import CategoryDb from "../../src/js/config/db/CategoryDb";
import SourceDb from "../../src/js/config/db/SourceDb";
import Category from "../../src/js/config/Category";
import Source from "../../src/js/config/Source";
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
            assert.strictEqual(1, new Date(categoryDocument.createdTime).getDate()); //eslint-disable-line no-magic-numbers
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

    describe("update", () => {
        let pouchClientUpdateMock = null, updatedParams = null, category = null;
        beforeEach("before", () => {
            let categoryParams = {
                "_id": "id",
                "docType": "category",
                "name": "sports",
                "createdTime": "1234345"
            };
            category = new Category(categoryParams);
            updatedParams = {
                "_id": "id",
                "docType": "category",
                "name": "sports",
                "createdTime": "1000000"
            };

            pouchClientUpdateMock = sandbox.mock(PouchClient).expects("updateDocument");
        });

        it("should update the document with new values", () => {
            pouchClientUpdateMock.withExactArgs(updatedParams).returns(Promise.resolve("response"));
            return category.update({ "createdTime": "1000000" }).then(() => {
                pouchClientUpdateMock.verify();
            });
        });

        it("should reject if update fails", () => {
            pouchClientUpdateMock.withExactArgs(updatedParams).returns(Promise.reject("error"));
            return category.update({ "createdTime": "1000000" }).catch(() => {
                pouchClientUpdateMock.verify();
            });
        });

        describe("name updation", () => {
            let fetchCategoryByNameMock = null;
            beforeEach("before", () => {
                updatedParams = {
                    "_id": "id",
                    "docType": "category",
                    "name": "sports new",
                    "createdTime": "1234345"
                };
                fetchCategoryByNameMock = sandbox.mock(CategoryDb).expects("fetchCategoryByName");
            });

            it("should update if name is unique", () => {
                let nameToBeUpdated = "sports new";
                fetchCategoryByNameMock.withArgs(nameToBeUpdated).returns(Promise.resolve([]));
                pouchClientUpdateMock.withExactArgs(updatedParams).returns(Promise.resolve("response"));
                return category.update({ "name": nameToBeUpdated }).then(() => {
                    pouchClientUpdateMock.verify();
                    fetchCategoryByNameMock.verify();
                });
            });

            it("should update if name is case insensitive", () => {
                let params = {
                    "_id": "id",
                    "docType": "category",
                    "name": "sports new",
                    "createdTime": "1234345"
                };
                category = new Category(params);
                let nameToBeUpdated = "Sports new";
                updatedParams = {
                    "_id": "id",
                    "docType": "category",
                    "name": "Sports new",
                    "createdTime": "1234345"
                };
                pouchClientUpdateMock.withExactArgs(updatedParams).returns(Promise.resolve("response"));
                return category.update({ "name": nameToBeUpdated }).then(() => {
                    pouchClientUpdateMock.verify();
                });
            });

            it("should not update if name is not unique", () => {
                let nameToBeUpdated = "sports new";
                fetchCategoryByNameMock.withArgs(nameToBeUpdated).returns(Promise.resolve([{ "_id": "id", "name": nameToBeUpdated }]));
                pouchClientUpdateMock.withExactArgs(updatedParams).never();
                return category.update({ "name": nameToBeUpdated }).catch((error) => {
                    assert.deepEqual(error, { "status": false, "error": "Category with name already exists" });
                    pouchClientUpdateMock.verify();
                    fetchCategoryByNameMock.verify();
                });
            });
        });
    });

    describe("delete", () => {
        let sourceId = null, categoryId = "id", categoryParams = null;
        let pouchClientDeleteDoucmentMock = null, pouchClientUpdateDoucmentMock = null;
        beforeEach("delete", () => {
            sandbox = sinon.sandbox.create();
            categoryParams = {
                "_id": "id",
                "_rev": "rev",
                "docType": "category",
                "name": "sports",
                "createdTime": "1234345"
            };

            pouchClientDeleteDoucmentMock = sandbox.mock(PouchClient).expects("deleteDocument");
        });

        it("delete category document along with the source references", () => {
            let category = new Category(categoryParams), fourTimes = 4;
            let urlDocs = [{ "_id": "101", "url": "@icc" }, { "_id": "102", "url": "@xyz" },
                { "_id": "103", "url": "http://facebook.com/test1" },
                { "_id": "104", "url": "http://test.com/rss" }];
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.resolve(urlDocs));
            let source = new Source({});
            sandbox.stub(Source, "instance").returns(source);
            let deleteSourceUrlMock = sandbox.mock(source).expects("delete").withArgs(categoryId).atMost(fourTimes).returns(Promise.resolve("response"));
            pouchClientDeleteDoucmentMock.withArgs(category.getDocument()).returns(Promise.resolve("response"));
            return category.delete(categoryId).then((response) => {
                assert.isTrue(response);
                deleteSourceUrlMock.verify();
                pouchClientDeleteDoucmentMock.verify();
            });
        });

        it("delete category document should fail if url deletion failed", () => {
            let category = new Category(categoryParams), fourTimes = 4;
            let urlDocs = [{ "_id": "101", "url": "@icc" }, { "_id": "102", "url": "@xyz" },
                { "_id": "103", "url": "http://facebook.com/test1" },
                { "_id": "104", "url": "http://test.com/rss" }];
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.resolve(urlDocs));
            let source = new Source({});
            sandbox.stub(Source, "instance").returns(source);
            let deleteSourceUrlMock = sandbox.mock(source).expects("delete").withArgs(categoryId).atMost(fourTimes).returns(Promise.reject("error"));
            return category.delete(categoryId).catch((error) => {
                assert.strictEqual(error, "error");
                deleteSourceUrlMock.verify();
            });
        });

        it("delete category document should be successful if no source urls present", () => {
            let category = new Category(categoryParams), fourTimes = 4;
            let urlDocs = [];
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.resolve(urlDocs));
            let source = new Source({});
            sandbox.stub(Source, "instance").returns(source);
            pouchClientDeleteDoucmentMock.withArgs(category.getDocument()).returns(Promise.resolve("response"));
            return category.delete(categoryId).then((response) => {
                assert.isTrue(response);
                pouchClientDeleteDoucmentMock.verify();
            });
        });

        it("should reject with false if category deletion fails", () => {
            let category = new Category(categoryParams), fourTimes = 4;
            let urlDocs = [{ "_id": "101", "url": "@icc" }, { "_id": "102", "url": "@xyz" },
                { "_id": "103", "url": "http://facebook.com/test1" },
                { "_id": "104", "url": "http://test.com/rss" }];
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.resolve(urlDocs));
            let source = new Source({});
            sandbox.stub(Source, "instance").returns(source);
            let deleteSourceUrlMock = sandbox.mock(source).expects("delete").withArgs(categoryId).atMost(fourTimes).returns(Promise.resolve("response"));
            pouchClientDeleteDoucmentMock.withArgs(category.getDocument()).returns(Promise.reject("error"));
            return category.delete(categoryId).catch((response) => {
                assert.strictEqual(response, "error");
                deleteSourceUrlMock.verify();
                pouchClientDeleteDoucmentMock.verify();
            });
        });

        it("should reject with false if fetchSourceConfigurationsByCategoryId fails", () => {
            let category = new Category(categoryParams);
            let fetchUrlsMock = sandbox.mock(SourceDb);
            fetchUrlsMock.expects("fetchSourceConfigurationsByCategoryId").withArgs(categoryId).returns(Promise.reject("error"));
            pouchClientDeleteDoucmentMock.withArgs(category.getDocument()).never();
            return category.delete(categoryId).catch((response) => {
                assert.strictEqual(response, "error");
                pouchClientDeleteDoucmentMock.verify();
            });
        });
    });
});

