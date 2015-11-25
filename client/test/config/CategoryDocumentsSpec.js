/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import CategoryDocument from "../../src/js/config/actions/CategoryDocuments.js";
import { assert } from "chai";
import sinon from "sinon";

describe("CategoryDocument", () => {
    describe("getNewCategoryDocument", () => {
        it("should return the category document", () => {
            let time = new Date().getTime();
            let stub = sinon.stub(CategoryDocument, "_getCreatedTime").returns(time);
            assert.deepEqual({ "name": "Sports", "docType": "category", "createdTime": time }, CategoryDocument.getNewCategoryDocument("Sports"));
            assert(stub.called);
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
            let expectedDocument =
                {
                    "docType": "source",
                    "sourceType": "rss",
                    "url": url,
                    "categoryIds": [categoryId]
                };
            assert.deepEqual(expectedDocument, CategoryDocument.getNewRssDocumnet(categoryId, url));
        });

        it("should throw an error if the url or category id is empty", () => {
            let newRssDocumentCallback = function() {
                CategoryDocument.getNewRssDocumnet("", "");
            };
            assert.throw(newRssDocumentCallback, "category id or url can not be empty");
        });
    });
});

