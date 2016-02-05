/* eslint max-nested-callbacks: [2, 7]*/

"use strict";
import DesignDocumentMigration from "../../../src/migration/helpers/DesignDocumentMigration.js";
import CouchClient from "../../../src/CouchClient.js";
import { assert } from "chai";
import sinon from "sinon";

describe("DesignDocumentMigration", ()=> {

    describe("addNewViews", () => {
        const accessToken = "testToken", dbName = "testDb", designDocName = "_design/category";
        let newViews = null, sandbox = null, couchClient = null, couchClientInstanceMock = null, couchClientGetDoucmentMock = null, couchClientSaveDocMock = null, existingDesignDoc = null, saveDesignDoc = null;
        beforeEach("addNewViews", () => {
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient(dbName, accessToken);
            couchClientInstanceMock = sandbox.mock(CouchClient).expects("instance");
            couchClientGetDoucmentMock = sandbox.mock(couchClient).expects("getDocument");
            couchClientSaveDocMock = sandbox.mock(couchClient).expects("saveDocument");
            newViews = {
                "surfFilter": {
                    "map": "function(doc) { if(doc.docType == 'surf-filter') {emit(doc._id, doc)} }"
                },
                "latestFeeds": {
                    "map": "function(doc) { if(doc.docType == 'feed' && (!doc.status || doc.status != 'park')) {emit(doc.postedDate, doc)} }"
                }
            };

            existingDesignDoc = {
                "views": {
                    "allCategories": {
                        "map": "function(doc) { if(doc.docType == 'category') {emit(doc._id, doc)} }"
                    }
                }
            };

            saveDesignDoc = {
                "views": {
                    "allCategories": {
                        "map": "function(doc) { if(doc.docType == 'category') {emit(doc._id, doc)} }"
                    },
                    "surfFilter": {
                        "map": "function(doc) { if(doc.docType == 'surf-filter') {emit(doc._id, doc)} }"
                    },
                    "latestFeeds": {
                        "map": "function(doc) { if(doc.docType == 'feed' && (!doc.status || doc.status != 'park')) {emit(doc.postedDate, doc)} }"
                    }
                }
            };
        });
        afterEach("addNewViews", () => {
            sandbox.restore();
        });
        it("should add the new views to the existing design document", (done) => {
            couchClientInstanceMock.withArgs(dbName, accessToken).returns(couchClient);
            couchClientGetDoucmentMock.withArgs("_design/category").returns(Promise.resolve(existingDesignDoc));
            couchClientSaveDocMock.withArgs("_design/category", saveDesignDoc).returns(Promise.resolve("success"));

            let designDocMigration = new DesignDocumentMigration(dbName, accessToken, designDocName);
            designDocMigration.addOrUpdateViews(newViews).then(response => {
                assert.strictEqual("success", response);
                couchClientInstanceMock.verify();
                couchClientGetDoucmentMock.verify();
                couchClientSaveDocMock.verify();
                done();
            });
        });

        it("should reject with error if there is failure while fetching the design document", (done) => {
            couchClientInstanceMock.withArgs(dbName, accessToken).returns(couchClient);
            couchClientGetDoucmentMock.withArgs("_design/category").returns(Promise.reject("error"));

            let designDocMigration = new DesignDocumentMigration(dbName, accessToken, designDocName);
            designDocMigration.addOrUpdateViews(newViews).catch(error => {
                assert.strictEqual("error", error);
                couchClientInstanceMock.verify();
                couchClientGetDoucmentMock.verify();
                done();
            });
        });

        it("should reject with error if there is failure while saving the updated design document", (done) => {
            couchClientInstanceMock.withArgs(dbName, accessToken).returns(couchClient);
            couchClientGetDoucmentMock.withArgs("_design/category").returns(Promise.resolve(existingDesignDoc));
            couchClientSaveDocMock.withArgs("_design/category", saveDesignDoc).returns(Promise.reject("error"));

            let designDocMigration = new DesignDocumentMigration(dbName, accessToken, designDocName);
            designDocMigration.addOrUpdateViews(newViews).catch(error => {
                assert.strictEqual("error", error);
                couchClientInstanceMock.verify();
                couchClientGetDoucmentMock.verify();
                couchClientSaveDocMock.verify();
                done();
            });
        });
    });
});
