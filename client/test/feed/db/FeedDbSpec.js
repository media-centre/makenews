/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../../src/js/db/PouchClient.js";
import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import sinon from "sinon";
import { expect } from "chai";

describe("FeedDb", () => {
    describe("fetchAllFeedsAndCategoriesWithSource", () => {
        it("should fetch all feeds and category documents", (done) => {
            let pouchClientMock = sinon.mock(PouchClient).expects("fetchLinkedDocuments").withArgs("category/allFeedsAndCategoriesWithSource", { "include_docs": true }).returns(Promise.resolve(""));
            FeedDb.fetchSurfFeedsAndCategoriesWithSource().then(() => {
                pouchClientMock.verify();
                PouchClient.fetchLinkedDocuments.restore();
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
});

