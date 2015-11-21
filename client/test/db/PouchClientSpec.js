/* eslint global-require:0 no-unused-expressions:0, max-nested-callbacks: [2, 7], no-magic-numbers:0*/

"use strict";
import DbSession from "../../src/js/db/DbSession.js";
import { expect } from "chai";
import PouchDB from "pouchdb";
import sinon from "sinon";
import PouchClient from "../../src/js/db/PouchClient.js";

describe("PouchClient", () => {
    before("PouchClient", () => {
        let pouch = new PouchDB("myDB", { "db": require("memdown") });
        sinon.stub(DbSession, "instance", () => {
            return pouch;
        });

        DbSession.instance().put({
            "docType": "category",
            "name": "Sports"
        }
            , "sportsCategoryId1");
        DbSession.instance().put({
            "docType": "category",
            "name": "Politics"
        }
            , "politicsCategoryId2");

        DbSession.instance().put({
            "docType": "source",
            "sourceType": "rss",
            "url": "www.hindu.com/rss",
            "categoryIds": ["sportsCategoryId1"]
        }
            , "rssId1");

        DbSession.instance().put({
            "docType": "source",
            "sourceType": "facebook",
            "url": "www.facebooksports.com",
            "categoryIds": ["sportsCategoryId1"]
        }
            , "fbId1");

        DbSession.instance().put({
            "docType": "source",
            "sourceType": "facebook",
            "url": "www.facebookpolitics.com",
            "categoryIds": ["politicsCategoryId2"]
        }
            , "fbId2");

        DbSession.instance().put({
            "language": "javascript",
            "views": {
                "allCategories": {
                    "map": "function(doc) { if(doc.docType === 'category') {emit(doc.docType, doc)} }"
                },
                "sourceConfigurations": {
                    "map": "function(doc) { if(doc.docType === 'source') {doc.categoryIds.forEach(function(id){emit(id, doc)})} }"
                },
                "allSourcesByUrl": {
                    "map": "function(doc) { if(doc.docType === 'source') {emit(doc.url, doc)} }"
                }
            } }, "_design/category");
    });

    after("PouchClient", () => {
        DbSession.instance.restore();
    });

    describe("fetchDocuments", () => {
        describe("allCategories", () => {
            it("should list all documents for the given queryPath", (done) => {
                PouchClient.fetchDocuments("category/allCategories", { "include_docs": true }).then((docs) => {
                    let actualCategories = docs.map((doc) => {
                        return doc.name;
                    });
                    expect(actualCategories).to.include("Sports");
                    expect(actualCategories).to.include("Politics");
                    done();
                });
            });
        });

        it("should return empty if no design document is present", (done) => {
            PouchClient.fetchDocuments("category/dummyView", { "include_docs": true }).then((docs) => {
                expect(0).to.eq(docs.length);
                done();
            });
        });

        it("should handle error on pouch error", (done) => {
            PouchClient.fetchDocuments(null, { "include_docs": true }).catch(() => {
                done();
            });
        });

        describe("sourceConfigurations", () => {
            it("should list all source configurations for every categoryId", (done) => {
                PouchClient.fetchDocuments("category/sourceConfigurations", { "include_docs": true, "key": "sportsCategoryId1" }).then((docs) => {
                    let actualUrls = docs.map((doc) => {
                        return doc.url;
                    });
                    expect(actualUrls).to.include("www.hindu.com/rss");
                    expect(actualUrls).to.include("www.facebooksports.com");
                    expect(actualUrls).to.not.include("www.facebookpolitics.com");
                    done();
                });
            });
        });

        describe("allSourcesByUrl", () => {
            it("should index all sourceConfigurations by url", (done) => {
                PouchClient.fetchDocuments("category/allSourcesByUrl", { "include_docs": true, "key": "www.hindu.com/rss" }).then((docs) => {
                    let resultDoc = docs[0];
                    expect(resultDoc.url).to.include("www.hindu.com/rss");
                    done();
                });
            });
        });
    });

    describe("createDocument", () => {
        it("should create the document with the given json object", (done) => {
            let jsonDocument = {
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryId": [
                    "8bc3db40aa04d6c65fd10d833f00163e"
                ]
            };

            PouchClient.createDocument(jsonDocument).then((response) => {
                expect(response.ok).to.be.true;
                expect(response.id).not.to.be.undefined;
                expect(response.rev).not.to.be.undefined;
                done();
            });
        });

        it("should reject with the error in case of error while creating the document", (done) => {
            let jsonDocument = {
                "_id": "id",
                "_rev": "1234",
                "docType": "source",
                "sourceType": "rss",
                "url": "www.google.com/rss",
                "categoryId": [
                    "8bc3db40aa04d6c65fd10d833f00163e"
                ]
            };

            PouchClient.createDocument(jsonDocument).catch((errorResponse) => {
                expect(errorResponse.error).to.be.true;
                done();
            });
        });
    });

    describe("getDocument", () => {
        it("should get document for the given id", (done) => {
            PouchClient.getDocument("sportsCategoryId1").then(document => {
                expect(document._id).to.eq("sportsCategoryId1");
                expect(document._rev).not.to.be.undefined;
                done();
            });
        });

        it("should reject with the error if document not found", (done) => {
            PouchClient.getDocument("invalidId").catch((errorResponse) => {
                expect(errorResponse.error).to.be.true;
                expect(errorResponse.status).to.eq(404);
                done();
            });
        });
    });
});
