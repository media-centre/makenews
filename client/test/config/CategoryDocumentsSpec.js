/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { CategoryDocument, STATUS_VALID } from "../../src/js/config/actions/CategoryDocuments.js";
import { assert } from "chai";

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

    describe("getNewDocument", () => {
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
            assert.deepEqual(expectedDocument, CategoryDocument.getNewDocument(categoryId, "rss", url, status));
        });

        it("should throw an error if the url or category id is empty", () => {
            let newRssDocumentCallback = function() {
                CategoryDocument.getNewDocument("", "");
            };
            assert.throw(newRssDocumentCallback, "category id or url can not be empty");
        });
    });

});
