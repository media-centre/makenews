/* eslint max-nested-callbacks: [2, 5] */

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import CategoryDb from "../../../src/js/config/db/CategoryDb.js";
import sinon from "sinon";
import {expect} from "chai";

describe("CategoryDb", () => {
    describe("fetchAllCategoryDocuments", () => {
        it("should fetch all category documents", () => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allCategories", { "include_docs": true });
            CategoryDb.fetchAllCategoryDocuments();
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });
    });

    describe("fetchSourceConfigurationsByCategoryId", () => {
        it("should fetch all the source configurations for a category id", () => {
            let categoryId = "categoryId";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/sourceConfigurations", { "include_docs": true, "key": categoryId });
            CategoryDb.fetchSourceConfigurationsByCategoryId(categoryId);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });

        it("should reject if the category id is empty", (done) => {
            CategoryDb.fetchSourceConfigurationsByCategoryId("").catch(error => {
                expect("category id should not be empty").to.equal(error);
                done();
            });
        });
    });

    describe("fetchSourceConfigurationByUrl", () => {
        it("should fetch all the source configurations for a url", () => {
            let url = "hindu.com/rss";
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/allSourcesByUrl", { "include_docs": true, "key": url });
            CategoryDb.fetchSourceConfigurationByUrl(url);
            pouchClientMock.verify();
            PouchClient.fetchDocuments.restore();
        });

        it("should reject if the category id is empty", (done) => {
            CategoryDb.fetchSourceConfigurationByUrl("").catch(error => {
                expect("url should not be empty").to.equal(error);
                done();
            });
        });
    });

    describe.only("createOrUpdateSource", () => {
        let fetchDocumentsStub = null;
        beforeEach("createOrUpdateSource", () => {
            fetchDocumentsStub = sinon.stub(PouchClient, "fetchDocuments");
        });
        afterEach("createOrUpdateSource", () => {
            PouchClient.fetchDocuments.restore();
        });

        it("should create Source if no source with url is found", () => {
            let jsonDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryId": [
                    "8bc3db40aa04d6c65fd10d833f00163e"
                ]
            };
            fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": jsonDocument.url });
            fetchDocumentsStub.returns(Promise.resolve([]));
            let pouchClientMock = sinon.mock(PouchClient).expects("createDocument").withArgs(jsonDocument).returns(Promise.resolve("resolve"));
            return CategoryDb.createOrUpdateSource(jsonDocument).then(() => {
                pouchClientMock.verify();
                PouchClient.createDocument.restore();
            });
        });

        it("should update Source if a source with given url exists", () => {
            let existingDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryIds": [
                    "id1"
                ]
            };
            let expectedCreateDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryIds": [
                    "id1", "id2"
                ]
            };

            let jsonDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryIds": [
                    "id2"
                ]
            };


            fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": jsonDocument.url });
            fetchDocumentsStub.returns(Promise.resolve([existingDocument]));
            let pouchClientMock = sinon.mock(PouchClient).expects("updateDocument").withArgs(expectedCreateDocument).returns(Promise.resolve(""));
            return CategoryDb.createOrUpdateSource(jsonDocument).then(() => {
                pouchClientMock.verify();
                PouchClient.updateDocument.restore();
            });
        });

        it("should reject if the document is empty", () => {
            return CategoryDb.createOrUpdateSource(null).catch(error => {
                expect("document should not be empty").to.equal(error);
            });
        });

        xit("should not update or create if the category id of a url is already exists in the document fetched from db", () => {
            let jsonDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryIds": [
                    "id2"
                ]
            };

            let existingDocument = jsonDocument;


            fetchDocumentsStub.withArgs("category/allSourcesByUrl", { "include_docs": true, "key": jsonDocument.url });
            fetchDocumentsStub.returns(Promise.resolve([existingDocument]));
            let pouchClientMock = sinon.mock(PouchClient).expects("updateDocument").never();
            return CategoryDb.createOrUpdateSource(jsonDocument).then(() => {
                pouchClientMock.verify();
                PouchClient.updateDocument.restore();
            });

        });
    });
});
