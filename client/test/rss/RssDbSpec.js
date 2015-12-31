/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../src/js/db/PouchClient.js";
import RssDb from "../../src/js/rss/RssDb.js";
import sinon from "sinon";

describe("RssDb", () => {
    describe("createFeeds", () => {
        it("should create all the feeds in the json", () => {
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

            let createMock = sinon.mock(PouchClient).expects("bulkDocuments").withArgs(jsonDocument).returns(Promise.resolve([{ "id": "1", "ok": true }, { "id": "2", "ok": true }]));
            return RssDb.addRssFeeds(jsonDocument).then(() => {
                createMock.verify();
                PouchClient.bulkDocuments.restore();
            });
        });
    });
});
