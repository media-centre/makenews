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

    describe("createTwitterFeed", ()=> {
        it("should return tweets with the desired format of description type", ()=> {
            let sourceId = "sourceId";
            let actualTweet = {
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id": 123456,
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }]
                }
            };

            let expectedTweet = {
                "_id": "123457",
                "type": "description",
                "docType": "feed",
                "sourceId": sourceId,
                "feedType": "twitter",
                "content": "Hindu twitter text - 123457",
                "tags": ["Fri Dec 11 11:41:56", "tag1", "tag2"]
            };
            let newTweets = CategoryDocument.createTwitterFeed(actualTweet, sourceId);
            expect(newTweets).to.deep.equal(expectedTweet);
        });

        it("should return tweets with the desired format of type imagecontent", ()=> {
            let sourceId = "sourceId";
            let actualTweet = {
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id": 123456,
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }],
                    "media": [{ "media_url": "http://www.test.com", "media_url_https": "https://www.test.com" }]
                }
            };

            let expectedTweet = {
                "_id": "123457",
                "type": "imagecontent",
                "docType": "feed",
                "sourceId": sourceId,
                "feedType": "twitter",
                "content": "Hindu twitter text - 123457",
                "tags": ["Fri Dec 11 11:41:56", "tag1", "tag2"],
                "url": "https://www.test.com"
            };
            let newTweets = CategoryDocument.createTwitterFeed(actualTweet, sourceId);
            expect(newTweets).to.deep.equal(expectedTweet);
        });

        it("should return tweets with the desired format of type gallery", ()=> {
            let sourceId = "sourceId";
            let actualTweet = {
                "metadata": {
                    "result_type": "recent"
                },
                "created_at": "Fri Dec 11 11:41:56",
                "id": 123456,
                "id_str": "123457",
                "text": "Hindu twitter text - 123457",
                "entities": {
                    "hashtags": [{ "text": "tag1" }, { "text": "tag2" }],
                    "media": [{ "media_url": "http://www.test1.com", "media_url_https": "https://www.test1.com" },
                        { "media_url": "http://www.test2.com", "media_url_https": "https://www.test2.com" }]
                }
            };

            let expectedTweet = {
                "_id": "123457",
                "type": "gallery",
                "docType": "feed",
                "sourceId": sourceId,
                "feedType": "twitter",
                "content": "Hindu twitter text - 123457",
                "tags": ["Fri Dec 11 11:41:56", "tag1", "tag2"],
                "images": [
                    {
                        "url": "https://www.test1.com"
                    },
                    {
                        "url": "https://www.test2.com"
                    }
                ]
            };
            let newTweets = CategoryDocument.createTwitterFeed(actualTweet, sourceId);
            expect(newTweets).to.deep.equal(expectedTweet);
        });
    });
});

