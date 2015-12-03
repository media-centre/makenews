/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { CategoryDocument, STATUS_INVALID, STATUS_VALID } from "../../src/js/config/actions/CategoryDocuments.js";
import { assert } from "chai";
import sinon from "sinon";

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
            let feedItems = [{ "title": "sports", "description": "desc" }];
            let expectedDocument =
                {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": url,
                    "categoryIds": [categoryId],
                    "status": status,
                    "feedItems": feedItems
                };
            assert.deepEqual(expectedDocument, CategoryDocument.getNewRssDocumnet(categoryId, url, status, feedItems));
        });

        it("should not set feedItems if status is invalid", () => {
            let categoryId = "8bc3db40aa04d6c65fd10d833f00163e";
            let url = "test url";
            let expectedDocument =
                {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": url,
                    "categoryIds": [categoryId],
                    "status": STATUS_INVALID
                };
            assert.deepEqual(expectedDocument, CategoryDocument.getNewRssDocumnet(categoryId, url, STATUS_INVALID));
        });

        it("should throw an error if the url or category id is empty", () => {
            let newRssDocumentCallback = function() {
                CategoryDocument.getNewRssDocumnet("", "");
            };
            assert.throw(newRssDocumentCallback, "category id or url can not be empty");
        });
    });
});

