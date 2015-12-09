/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { CategoryDocument, STATUS_INVALID, STATUS_VALID } from "../../src/js/config/actions/CategoryDocuments.js";
import { assert, expect} from "chai";

describe("CategoryDocument", () => {
    describe("getNewCategoryDocument", () => {
        it("should return the category document", () => {
            let doc = CategoryDocument.getNewCategoryDocument("Sports");
            let time = doc.createdTime;
            assert.deepEqual({ "name": "Sports", "docType": "category", "createdTime": time }, doc);
        });

        it("should throw an error if the category name is empty", () => {
            let newCategoryDocumentCallback = function() {
                CategoryDocument.getNewCategoryDocument("");
            };
            assert.throw(newCategoryDocumentCallback, "category name can not be empty");
        });
    });

    describe("getNewRssDocumnet", () => {
        it("should return the new rss document", () => {
            let categoryId = "8bc3db40aa04d6c65fd10d833f00163e";
            let url = "test url";
            let status = STATUS_VALID;
            let expectedDocument =
                {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": url,
                    "categoryIds": [categoryId],
                    "status": status
                };
            assert.deepEqual(expectedDocument, CategoryDocument.getNewRssDocumnet(categoryId, url, status));
        });

        it("should throw an error if the url or category id is empty", () => {
            let newRssDocumentCallback = function() {
                CategoryDocument.getNewRssDocumnet("", "");
            };
            assert.throw(newRssDocumentCallback, "category id or url can not be empty");
        });
    });

    describe("getNewFeedDocuments", ()=> {
        it("should return feeds with given source id", ()=> {
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
                    "docType": "feed",
                    "sourceId": sourceId,
                    "title": "sports - cricket",
                    "description": "desc",
                    "guid": "sportsGuid1"
                },
                {
                    "docType": "feed",
                    "sourceId": sourceId,
                    "title": "sports - football",
                    "description": "desc",
                    "guid": "sportsGuid2"
                }];
            let newFeeds = CategoryDocument.getNewFeedDocuments(sourceId, feeds);
            expect(newFeeds).to.deep.equal(expectedFeeds);
        });

        it("should throw an error if the sourceId is empty", () => {
            let newFeedDocumentCallback = function() {
                CategoryDocument.getNewFeedDocuments("", [{"id": 1}]);
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });

        it("should throw an error if the feeds is empty", () => {
            let newFeedDocumentCallback = function() {
                CategoryDocument.getNewFeedDocuments("test", []);
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });

        it("should throw an error if the feeds is undefined", () => {
            let newFeedDocumentCallback = function() {
                CategoryDocument.getNewFeedDocuments("test");
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });
    });
});

