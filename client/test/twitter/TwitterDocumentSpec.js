/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import TwitterDocument from "../../src/js/twitter/TwitterDocument.js";
import { expect, assert } from "chai";

describe("getNewDocument", () => {
    it("should return the new rss document", () => {
        let categoryId = "8bc3db40aa04d6c65fd10d833f00163e";
        let url = "test url";
        let status = "valid";
        let expectedDocument = {
            "docType": "source",
            "sourceType": "rss",
            "url": url,
            "categoryIds": [categoryId],
            "status": status
        };
        assert.deepEqual(expectedDocument, TwitterDocument.getSourceUrlDocument(categoryId, "rss", url, status));
    });

    it("should throw an error if the url or category id is empty", () => {
        let newRssDocumentCallback = function() {
            TwitterDocument.getSourceUrlDocument("", "");
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
        let newTweets = TwitterDocument.parseFeed(actualTweet, sourceId);
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
        let newTweets = TwitterDocument.parseFeed(actualTweet, sourceId);
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
        let newTweets = TwitterDocument.parseFeed(actualTweet, sourceId);
        expect(newTweets).to.deep.equal(expectedTweet);
    });
});
