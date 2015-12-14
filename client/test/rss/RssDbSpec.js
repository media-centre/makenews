/* eslint max-nested-callbacks: [2, 5] no-unused-expressions:0, no-unused-vars:0, no-undefined:0*/

"use strict";
import PouchClient from "../../src/js/db/PouchClient.js";
import RssDb from "../../src/js/rss/RssDb.js";
import RssDocument from "../../src/js/rss/RssDocument.js";
import sinon from "sinon";
import { expect } from "chai";

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

            let createMock = sinon.mock(PouchClient).expects("createBulkDocuments").withArgs(jsonDocument).returns(Promise.resolve([{ "id": "1", "ok": true }, { "id": "2", "ok": true }]));
            return RssDb.createFeeds(jsonDocument).then(() => {
                createMock.verify();
                PouchClient.createBulkDocuments.restore();
            });
        });
    });

    describe("addRssFeeds", () => {
        it("should add rss feeds for given source", () => {
            let sourceId = "sourceId";
            let feeds = [
                {
                    "title": "sports - cricket",
                    "description": "desc",
                    "guid": "sportsGuid1"
                },
                {
                    "title": "sports - football",
                    "description": "desc",
                    "guid": "sportsGuid2"
                }];

            let expectedFeeds = [
                {
                    "sourceId": sourceId,
                    "title": "sports - cricket",
                    "description": "desc",
                    "guid": "sportsGuid1"
                },
                {
                    "sourceId": sourceId,
                    "title": "sports - football",
                    "description": "desc",
                    "guid": "sportsGuid2"
                }];
            sinon.stub(RssDocument, "getNewFeedDocuments").withArgs(sourceId, feeds).returns(expectedFeeds);
            let createFeedsMock = sinon.mock(RssDb).expects("createFeeds");
            createFeedsMock.withArgs(expectedFeeds);
            RssDb.addRssFeeds(sourceId, feeds);
            createFeedsMock.verify();
            RssDocument.getNewFeedDocuments.restore();
            RssDb.createFeeds.restore();
        });
    });
});
