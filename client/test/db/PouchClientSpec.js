/* eslint global-require:0 no-unused-expressions:0, max-nested-callbacks: [2, 7], no-magic-numbers:0, no-unused-vars:0*/

"use strict";
import PouchClient from "../../src/js/db/PouchClient.js";
import DbSession from "../../src/js/db/DbSession.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { expect, assert } from "chai";
import PouchDB from "pouchdb";
import sinon from "sinon";

describe("PouchClient", () => {
    let parkFeed = null, surfFeed = null;
    before("PouchClient", () => {
        let pouch = new PouchDB("myDB", { "db": require("memdown") });
        sinon.stub(DbSession, "instance").returns(Promise.resolve(pouch));

        DbSession.instance().then(session => {
            session.put({
                "docType": "category",
                "name": "Long Title",
                "_id": "E9D29C23-1CAA-BDCE-BBCD-9E84611351A5",
                "_rev": "14-a050422e3a9367aa519109443f86810c"
            });
        });

        DbSession.instance().then(session => {
            session.put({
                "docType": "category",
                "name": "Sports"
            }
                , "sportsCategoryId1");
        });

        DbSession.instance().then(session => {
            session.put({

                "docType": "category",
                "name": "Politics"
            }
                , "politicsCategoryId2");
        });

        DbSession.instance().then(session => {
            session.put({
                "docType": "source",
                "sourceType": "rss",
                "url": "www.hindu.com/rss",
                "categoryIds": ["sportsCategoryId1", "politicsCategoryId2"]
            }
                , "rssId1");
        });

        DbSession.instance().then(session => {
            session.put({

                "docType": "source",
                "sourceType": "facebook",
                "url": "www.facebooksports.com",
                "categoryIds": ["sportsCategoryId1"]
            }
                , "fbId1");
        });

        DbSession.instance().then(session => {
            session.put({
                "docType": "source",
                "sourceType": "rss",
                "url": "www.facebookpolitics.com",
                "categoryIds": ["politicsCategoryId2"]
            }
                , "rssId2");
        });

        surfFeed = {
            "docType": "feed",
            "title": "tn",
            "description": "www.facebookpolitics.com",
            "sourceId": "rssId1",
            "postedDate": "2015-10-02T04:09:17+00:00"
        };

        DbSession.instance().then(session => {
            session.put(surfFeed
                , "feedId1");
        });

        parkFeed = {
            "docType": "feed",
            "title": "tn3",
            "description": "www.fbpolitics.com",
            "sourceId": "fbId1",
            "status": "park",
            "postedDate": "2015-10-04T04:09:17+00:00"
        };
        DbSession.instance().then(session => {
            session.put(parkFeed, "feedId2");
        });

        DbSession.instance().then(session => {
            session.put({
                "language": "javascript",
                "views": {
                    "allCategories": {
                        "map": "function(doc) { if(doc.docType == 'category') {emit(doc._id, doc)} }"
                    },
                    "allCategoriesByName": {
                        "map": "function(doc) { if(doc.docType == 'category') {emit(doc.name, doc)} }"
                    },
                    "sourceConfigurations": {
                        "map": "function(doc) { if(doc.docType == 'source') {doc.categoryIds.forEach(function(id){emit(id, doc)})} }"
                    },
                    "allSourcesByUrl": {
                        "map": "function(doc) { if(doc.docType == 'source') {emit(doc.url, doc)} }"
                    },
                    "allFeedsAndCategoriesWithSource": {
                        "map": "function(doc) { if(doc.docType == 'source') { doc.categoryIds.forEach(function(id) {emit(doc._id, {_id:id});});} " +
                        "else if(doc.docType == 'feed' && (!doc.status || doc.status == 'surf')) { emit(doc.postedDate, doc.sourceId);}}"
                    },
                    "parkedFeeds": {
                        "map": "function(doc) { if(doc.docType == 'source') { doc.categoryIds.forEach(function(id) {emit(doc._id, {_id:id});});} " +
                        "else if(doc.docType == 'feed' && doc.status == 'park') { emit(doc.postedDate, doc.sourceId);}}"
                    },
                    "parkedFeedsCount": {
                        "map": "function(doc) { if(doc.docType == 'feed' && doc.status == 'park') { emit(doc._id, null);}}",
                        "reduce": "_count"
                    },
                    "surfFeeds": {
                        "map": "function(doc) { if(doc.docType == 'feed' && (!doc.status || doc.status != 'park')) { emit(doc.sourceId, doc);}}"
                    },
                    "sourceParkFeeds": {
                        "map": "function(doc) { if(doc.docType == 'feed' && doc.status == 'park') { emit(doc.sourceId, doc);}}"
                    }
                }
            }, "_design/category");
        });
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
                PouchClient.fetchDocuments("category/sourceConfigurations", {
                    "include_docs": true,
                    "key": "sportsCategoryId1"
                }).then((docs) => {
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
                PouchClient.fetchDocuments("category/allSourcesByUrl", {
                    "include_docs": true,
                    "key": "www.hindu.com/rss"
                }).then((docs) => {
                    let resultDoc = docs[0];
                    expect(resultDoc.url).to.include("www.hindu.com/rss");
                    done();
                });
            });
        });

        describe("allCategoriesByName", () => {
            it("should index all categories by name", (done) => {
                PouchClient.fetchDocuments("category/allCategoriesByName", {
                    "include_docs": true,
                    "key": "Sports"
                }).then((docs) => {
                    let resultDoc = docs[0];
                    expect(resultDoc.name).to.include("Sports");
                    done();
                });
            });
        });

        function assertFeedView(actual, docId, sourceId, expectedFeed) {
            let feedFound = false;
            actual.forEach((doc) => {
                if (doc.id === docId) {
                    expect(doc.key).to.eq(sourceId);
                    assertFeed(doc.doc, expectedFeed);
                    feedFound = true;
                }
            });
            assert.ok(feedFound);
        }

        function assertFeed(actual, expected) {
            assert.strictEqual(actual.docType, expected.docType);
            assert.strictEqual(actual.title, expected.title);
            assert.strictEqual(actual.description, expected.description);
            assert.strictEqual(actual.sourceId, expected.sourceId);
            assert.strictEqual(actual.status, expected.status);
        }

        describe("allFeedsAndCategoriesWithSource", () => {
            it("should index feeds for all categories by category id", (done) => {
                PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", { "include_docs": true }).then((doc) => {
                    expect(doc.map((item)=> {
                        return item.key;
                    })).to.deep.eq(["2015-10-02T04:09:17+00:00", "fbId1", "rssId1", "rssId1", "rssId2"]);

                    let rssSourceRelatedDocTypes = doc.map(relatedDoc => {
                        return relatedDoc.doc.docType;
                    });
                    expect(rssSourceRelatedDocTypes).to.include("category");
                    expect(rssSourceRelatedDocTypes).to.include("feed");
                    done();
                });
            });

            it("should get surf feeds", (done) => {
                PouchClient.fetchLinkedDocuments("category/allFeedsAndCategoriesWithSource", { "include_docs": true, "descending": true }).then((doc) => {
                    assertFeedView(doc, "feedId1", "2015-10-02T04:09:17+00:00", surfFeed);
                    done();
                });
            });
        });

        describe("parkedFeeds", () => {
            it("should index feeds for all categories by category id", (done) => {
                PouchClient.fetchLinkedDocuments("category/parkedFeeds", { "include_docs": true }).then((doc) => {
                    expect(doc.map((item)=> {
                        return item.key;
                    })).to.deep.eq(["2015-10-04T04:09:17+00:00", "fbId1", "rssId1", "rssId1", "rssId2"]);

                    let rssSourceRelatedDocTypes = doc.map(relatedDoc => {
                        return relatedDoc.doc.docType;
                    });
                    expect(rssSourceRelatedDocTypes).to.include("category");
                    expect(rssSourceRelatedDocTypes).to.include("feed");
                    done();
                });
            });

            it("should get park feeds", (done) => {
                PouchClient.fetchLinkedDocuments("category/parkedFeeds", { "include_docs": true }).then((doc) => {
                    assertFeedView(doc, "feedId2", "2015-10-04T04:09:17+00:00", parkFeed);
                    done();
                });
            });
        });

        describe("parkedFeedsCount", () => {
            it("should return count of parkedFeeds", (done) => {
                PouchClient.fetchDocuments("category/parkedFeedsCount", { "reduce": true }).then((doc) => {
                    expect(doc).to.deep.eq([1]);
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
            let documentInput = {
                "docType": "category",
                "name": "Renamed",
                "createdTime": 1448540914840,
                "_id": "E9D29C23-1CAA-BDCE-BBCD-9E84611351A5",
                "_rev": "14-a050422e3a9367aa519109443f86810c"
            };
            PouchClient.updateDocument(documentInput).then(document => {
                expect(document._id).to.eq(documentInput._id);
                done();
            });
        });
    });

    describe("bulkDocuments", () => {
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

            return PouchClient.bulkDocuments(jsonDocument).then((response) => {
                let expectedIds = ["guid1", "guid2"];
                expect(response.length).to.eq(2);
                expect(response.map(resp => {
                    return resp.id;
                })).to.deep.eq(expectedIds);
                expect(response[0].rev).not.to.be.undefined;
                expect(response[1].rev).not.to.be.undefined;
            });
        });

        it("should reject with the error in case of error while creating the documents", (done) => {
            let invalidDocument = { "_id": "invalidId", "title": "INVALID" };
            PouchClient.bulkDocuments(invalidDocument).catch((error) => {
                assert.isTrue(error.error);
                assert.equal(HttpResponseHandler.codes.BAD_REQUEST, error.status);
                done();
            });
        });
    });

    describe("deleteDocument", () => {
        it("should delete the given document", (done) => {
            DbSession.instance().then(session => {
                session.put({
                    "docType": "source",
                    "sourceType": "rss",
                    "url": "www.facebookpolitics.com",
                    "categoryIds": ["politicsCategoryId2"]
                }
                    , "deleteId1").then(putResponse => {
                        session.get("deleteId1").then(document => {
                            PouchClient.deleteDocument(document).then((response) => {
                                assert.isTrue(response.ok);
                                assert.strictEqual("deleteId1", response.id);
                                done();
                            });
                        });
                    });
            });
        });

        it("should reject with an error while deleting the document", (done) => {
            let invalidDocument = { "_id": "invalidId", "title": "INVALID" };
            PouchClient.deleteDocument(invalidDocument).catch((error) => {
                expect(error.error).to.be.true;
                expect(error.status).to.eq(HttpResponseHandler.codes.NOT_FOUND);
                done();
            });
        });

        it("should reject with an error if the document is null", (done) => {
            PouchClient.deleteDocument(null).catch((error) => {
                assert.strictEqual("document can not be empty", error);
                done();
            });
        });
    });

    describe("surfFeeds", () => {
        before("surfFeeds", () => {
            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd.net"
                }, "S163974433696568_968907333203270");
            });

            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Timeline Photos",
                    "feedType": "facebook",
                    "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                    "tags": [
                        "Dec 29 2015    8:9:17"
                    ],
                    "url": "https://fbcdn-photos-h-a.akamaihd.net"
                }, "S163974433696568_968914649869205");
            });

            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "1BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "The Hindu Lit for Life",
                    "feedType": "facebook",
                    "content": "Register for The Hindu Lit for Life 2016 soon!",
                    "tags": [
                        "Dec 29 2015    14:32:13"
                    ],
                    "url": "https://fbcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-0/s130x130/946453_1071103756290828_7626184021542195939_n.jpg?oh=9abd049b24ea6a41dcc265a7783e1f33&oe=56D3C7D2&__gda__=1459863968_336e8f0d38b164c04c2c603da69fe91e"
                }, "S163974433696568_969041863189817");
            });
        });

        it("should fetch all surf feeds ", (done) => {
            PouchClient.fetchDocuments("category/surfFeeds", {
                "include_docs": true,
                "key": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48"
            }).then((docs) => {
                assert.include(["Chennai patient receives heart from brain-dead man in CMC", "Martina Hingis and I complement each other, says Sania Mirza in a candid chat."], docs[0].content);
                assert.include(["Chennai patient receives heart from brain-dead man in CMC", "Martina Hingis and I complement each other, says Sania Mirza in a candid chat."], docs[1].content);
                done();
            });
        });
    });

    describe("sourceParkFeeds", () => {
        before("sourceParkFeeds", () => {
            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "0AD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Chennai Connect at The Hindu",
                    "feedType": "facebook",
                    "content": "Chennai patient receives heart from brain-dead man in CMC",
                    "status": "park",
                    "tags": [
                        "Dec 29 2015    7:47:59"
                    ],
                    "url": "https://fbcdn-photos-f-a.akamaihd.net"
                }, "P163974433696568_968907333203270");
            });

            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "0AD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "Timeline Photos",
                    "feedType": "facebook",
                    "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                    "tags": [
                        "Dec 29 2015    8:9:17"
                    ],
                    "url": "https://fbcdn-photos-h-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/s130x130/993834_968914649869205_4718370789719324851_n.jpg?oh=c00c3e984da0d49a65fb6342e5ffb272&oe=57191FE6&__gda__=1461844690_a1b41bffa7af2d1bd8f80072af88adff"
                }, "P163974433696568_968914649869205");
            });

            DbSession.instance().then(session => {
                session.put({
                    "docType": "feed",
                    "sourceId": "2BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                    "type": "imagecontent",
                    "title": "The Hindu Lit for Life",
                    "feedType": "facebook",
                    "content": "Register for The Hindu Lit for Life 2016 soon!",
                    "tags": [
                        "Dec 29 2015    14:32:13"
                    ],
                    "status": "park",
                    "url": "https://fbcdn-photos-b-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-0/s130x130/946453_1071103756290828_7626184021542195939_n.jpg?oh=9abd049b24ea6a41dcc265a7783e1f33&oe=56D3C7D2&__gda__=1459863968_336e8f0d38b164c04c2c603da69fe91e"
                }, "P163974433696568_969041863189817");
            });
        });
        it("should fetch all surf feeds ", (done) => {
            PouchClient.fetchDocuments("category/sourceParkFeeds", {
                "include_docs": true,
                "key": "0AD6EF4F-3DED-BA7D-9878-9A616E16DF48"
            }).then((docs) => {
                assert.strictEqual("Chennai patient receives heart from brain-dead man in CMC", docs[0].content);
                done();
            });
        });
    });

});
