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
            "name": "Long Title",
            "_id": "E9D29C23-1CAA-BDCE-BBCD-9E84611351A5",
            "_rev": "14-a050422e3a9367aa519109443f86810c"
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
            "categoryIds": ["sportsCategoryId1", "politicsCategoryId2"]
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
            "sourceType": "rss",
            "url": "www.facebookpolitics.com",
            "categoryIds": ["politicsCategoryId2"]
        }
            , "rssId2");

        DbSession.instance().put({
            "docType": "feed",
            "title": "tn",
            "description": "www.facebookpolitics.com",
            "sourceId": "rssId1"
        }
            , "feedId1");

        DbSession.instance().put({
            "language": "javascript",
            "views": {
                "allCategories": {
                    "map": "function(doc) { if(doc.docType === 'category') {emit(doc.docType, doc)} }"
                },
                "allCategoriesByName": {
                    "map": "function(doc) { if(doc.docType === 'category') {emit(doc.name, doc)} }"
                },
                "sourceConfigurations": {
                    "map": "function(doc) { if(doc.docType === 'source') {doc.categoryIds.forEach(function(id){emit(id, doc)})} }"
                },
                "allSourcesByUrl": {
                    "map": "function(doc) { if(doc.docType === 'source') {emit(doc.url, doc)} }"
                },
                "allFeedsAndCategoriesWithSource": {
                    "map": "function(doc) { if(doc.docType == 'source') { doc.categoryIds.forEach(function(id) {emit(doc._id, {_id:id});});} else if(doc.docType == 'feed') { emit(doc.sourceId, null);}}"
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

        describe("allCategoriesByName", () => {
            it("should index all categories by name", (done) => {
                PouchClient.fetchDocuments("category/allCategoriesByName", { "include_docs": true, "key": "Sports" }).then((docs) => {
                    let resultDoc = docs[0];
                    expect(resultDoc.name).to.include("Sports");
                    done();
                });
            });
        });

        describe("allFeedsAndCategoriesWithSource", () => {
            it("should index all feeds for all categories by category id", (done) => {
                PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", { "include_docs": true }).then((doc) => {
                    expect(doc.map((item)=> {
                        return item.key;
                    })).to.deep.eq(["fbId1", "rssId1", "rssId1", "rssId1", "rssId2"]);

                    let rssSourceRelatedDocTypes = doc.map(relatedDoc => {
                        return relatedDoc.doc.docType;
                    });

                    expect(doc[0].doc.docType).not.to.eq("feed");
                    expect(rssSourceRelatedDocTypes).to.include("category");
                    expect(rssSourceRelatedDocTypes).to.include("feed");
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

    describe("updateDocument", () => {

        xit("should update the document", (done) => {
            let documentInput = { "docType": "category", "name": "Renamed", "createdTime": 1448540914840, "_id": "E9D29C23-1CAA-BDCE-BBCD-9E84611351A5", "_rev": "14-a050422e3a9367aa519109443f86810c" };
            PouchClient.updateDocument(documentInput).then(document => {
                expect(document._id).to.eq(documentInput._id);
                done();
            });
        });
    });

    describe("createBulkDocuments", () => {
        it("should create all the documents with the given json object", () => {
            let jsonDocument = [
                {
                    "_id": "guid1",
                    "docType": "feed",
                    "title": "www.google.com/rss"
                },
                {
                    "_id": "guid2",
                    "docType": "feed",
                    "title": "www.hindu.com/rss"
                }];

            return PouchClient.createBulkDocuments(jsonDocument).then((response) => {
                let expectedIds = ["guid1", "guid2"];
                expect(response.length).to.eq(2);
                expect(response.map(resp => {
                    return resp.id;
                })).to.deep.eq(expectedIds);
                expect(response[0].rev).not.to.be.undefined;
                expect(response[1].rev).not.to.be.undefined;
            });
        });

        xit("should reject with the error in case of error while creating the documents", (done) => {
            DbSession.instance().put({
                "docType": "feed",
                "title": "www.google.com/rss"
            }, "guid1");

            let jsonDocument = [
                {
                    "_id": "guid1",
                    "docType": "feed",
                    "title": "www.google.com/rss"
                },
                {
                    "_id": "guid2",
                    "docType": "feed",
                    "title": "www.hindu.com/rss"
                }];

            PouchClient.createBulkDocuments(jsonDocument).then(() => {
                done();
            });
        });
    });
});
