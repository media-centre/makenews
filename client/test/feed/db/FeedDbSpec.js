/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import sinon from "sinon";
import { expect, assert } from "chai";

describe("FeedDb", () => {
    describe("fetchAllFeedsAndCategoriesWithSource", () => {
        it("should fetch all feeds and category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient);
            pouchClientMock.expects("fetchLinkedDocuments").withArgs("category/allFeedsAndCategoriesWithSource", { "include_docs": true, "descending": true }).returns(Promise.resolve(""));
            FeedDb.fetchSurfFeedsAndCategoriesWithSource().then(() => {
                pouchClientMock.verify();
                pouchClientMock.restore();
                done();
            });
        });
        it("should fetch all feeds and category documents with the custom options", (done) => {
            let pouchClientMock = sinon.mock(PouchClient);
            const options = { "include_docs": true, "descending": false };
            pouchClientMock.expects("fetchLinkedDocuments").withArgs("category/allFeedsAndCategoriesWithSource", options).returns(Promise.resolve(""));
            FeedDb.fetchSurfFeedsAndCategoriesWithSource(options).then(() => {
                pouchClientMock.verify();
                pouchClientMock.restore();
                done();
            });
        });
    });
    describe("fetchParkFeeds", () => {
        it("should fetch all parked feeds and category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient);
            pouchClientMock.expects("fetchLinkedDocuments").withArgs("category/parkedFeeds", { "include_docs": true, "descending": true }).returns(Promise.resolve(""));
            FeedDb.fetchParkFeeds().then(() => {
                pouchClientMock.verify();
                pouchClientMock.restore();
                done();
            });
        });
        it("should fetch all parked feeds and category documents with the custom options", (done) => {
            let pouchClientMock = sinon.mock(PouchClient);
            const options = { "include_docs": true, "descending": false };
            pouchClientMock.expects("fetchLinkedDocuments").withArgs("category/parkedFeeds", options).returns(Promise.resolve(""));
            FeedDb.fetchParkFeeds(options).then(() => {
                pouchClientMock.verify();
                pouchClientMock.restore();
                done();
            });
        });
    });

    describe("updateFeed", () => {
        it("should update the feed document ", (done) => {
            let feedDocument = {
                "_id": "feedId",
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1",
                "status": "park"
            };
            let updateMock = sinon.mock(PouchClient).expects("updateDocument").withArgs(feedDocument).returns(Promise.resolve("success"));
            FeedDb.updateFeed(feedDocument).then(()=> {
                updateMock.verify();
                PouchClient.updateDocument.restore();
                done();
            });
        });
    });

    describe("parkedFeedsCount", () => {
        it("should return the count of parked feeds", (done) => {
            let parkFeedsCount = 100;
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchDocuments").withArgs("category/parkedFeedsCount", { "reduce": true }).returns(Promise.resolve([parkFeedsCount]));
            FeedDb.parkedFeedsCount().then((count) => {
                expect(parkFeedsCount).to.eq(count);
                pouchClientMock.verify();
                PouchClient.fetchDocuments.restore();
                done();
            });
        });

        it("should reject with error if fetching documents fails", () => {
            let pouchClientMock = sinon.stub(PouchClient, "fetchDocuments");
            pouchClientMock.returns(Promise.reject("error"));
            return FeedDb.parkedFeedsCount().catch(error => {
                expect(error).to.eq("error");
                PouchClient.fetchDocuments.restore();
            });
        });
    });

    describe("surfFeeds", () => {
        let sourceId = null, expectedSurfFeeds = null;
        before("surfFeeds", () => {
            sourceId = "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48";
            expectedSurfFeeds = [{
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Chennai Connect at The Hindu",
                "feedType": "facebook",
                "content": "Chennai patient receives heart from brain-dead man in CMC",
                "tags": [
                    "Dec 29 2015    7:47:59"
                ],
                "url": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xpl1/v/t1.0-0/s130x130/10402743_1012773958745185_3635117216496008201_n.jpg?oh=6654df3ae8d6a2accce78a8d39bd0e22&oe=5709CE3C&__gda__=1459644057_ac6d4414114d43b6cf927a34ba7e5612"
            }, {
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Timeline Photos",
                "feedType": "facebook",
                "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                "tags": [
                    "Dec 29 2015    8:9:17"
                ],
                "url": "https://fbcdn-photos-h-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/s130x130/993834_968914649869205_4718370789719324851_n.jpg?oh=c00c3e984da0d49a65fb6342e5ffb272&oe=57191FE6&__gda__=1461844690_a1b41bffa7af2d1bd8f80072af88adff"
            }];
        });

        it("should get all surf feeds which belongs to some source(url) id", (done) => {
            let fetchDocumentMock = sinon.mock(PouchClient);
            fetchDocumentMock.expects("fetchDocuments").withArgs("category/surfFeeds", {
                "include_docs": true,
                "key": sourceId
            }).returns(Promise.resolve(expectedSurfFeeds));
            FeedDb.surfFeeds(sourceId).then((surfFeedDocs) => {
                assert.strictEqual("Chennai Connect at The Hindu", surfFeedDocs[0].title);
                fetchDocumentMock.verify();
                fetchDocumentMock.restore();
                done();
            });
        });

    });


    describe("sourceParkFeeds", () => {
        let sourceId = null, expectedParkFeeds = null;
        before("sourceParkFeeds", () => {
            sourceId = "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48";
            expectedParkFeeds = [{
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Chennai Connect at The Hindu",
                "feedType": "facebook",
                "content": "Chennai patient receives heart from brain-dead man in CMC",
                "status": "park",
                "tags": [
                    "Dec 29 2015    7:47:59"
                ],
                "url": "https://fbcdn-photos-f-a.akamaihd.net/hphotos-ak-xpl1/v/t1.0-0/s130x130/10402743_1012773958745185_3635117216496008201_n.jpg?oh=6654df3ae8d6a2accce78a8d39bd0e22&oe=5709CE3C&__gda__=1459644057_ac6d4414114d43b6cf927a34ba7e5612"
            }, {
                "docType": "feed",
                "sourceId": "0BD6EF4F-3DED-BA7D-9878-9A616E16DF48",
                "type": "imagecontent",
                "title": "Timeline Photos",
                "feedType": "facebook",
                "content": "Martina Hingis and I complement each other, says Sania Mirza in a candid chat.",
                "status": "park",
                "tags": [
                    "Dec 29 2015    8:9:17"
                ],
                "url": "https://fbcdn-photos-h-a.akamaihd.net/hphotos-ak-xtp1/v/t1.0-0/s130x130/993834_968914649869205_4718370789719324851_n.jpg?oh=c00c3e984da0d49a65fb6342e5ffb272&oe=57191FE6&__gda__=1461844690_a1b41bffa7af2d1bd8f80072af88adff"
            }];
        });

        it("should get all park feeds which belongs to some source(url) id", (done) => {
            let fetchDocumentMock = sinon.mock(PouchClient);
            fetchDocumentMock.expects("fetchDocuments").withArgs("category/sourceParkFeeds", {
                "include_docs": true,
                "key": sourceId
            }).returns(Promise.resolve(expectedParkFeeds));
            FeedDb.sourceParkFeeds(sourceId).then((parkFeedDocs) => {
                assert.strictEqual("Chennai Connect at The Hindu", parkFeedDocs[0].title);
                fetchDocumentMock.verify();
                fetchDocumentMock.restore();
                done();
            });
        });

    });
});

