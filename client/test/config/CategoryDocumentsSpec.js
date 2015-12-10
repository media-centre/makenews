/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { CategoryDocument, STATUS_VALID } from "../../src/js/config/actions/CategoryDocuments.js";
import { assert, expect } from "chai";

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
        it("should return feeds with the desired format of description type", ()=> {
            let sourceId = "sourceId";
            let feeds = [
                {
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "description": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "summary": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "date": "2015-11-05T11:21:20.000Z",
                    "pubdate": "2015-11-05T11:21:20.000Z",
                    "pubDate": "2015-11-05T11:21:20.000Z",
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "guid": "http://www.theguardian.com/world/picture/guid1",
                    "author": "Tran Van Tuy",
                    "comments": null,
                    "origlink": null,
                    "image": {},
                    "source": {},
                    "categories": [
                        "Vietnam",
                        "World news",
                        "Asia Pacific"
                    ],
                    "enclosures": [],
                    "permalink": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam"
                },

                {
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "description": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "summary": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "date": null,
                    "pubdate": null,
                    "pubDate": null,
                    "link": "http://www.hindu.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "guid": "http://www.theguardian.com/world/picture/guid2",
                    "author": "Tran Van Tuy",
                    "comments": null,
                    "origlink": null,
                    "image": {},
                    "source": {},
                    "categories": [
                        "Vietnam",
                        "World news",
                        "Asia Pacific"
                    ],
                    "enclosures": [],
                    "permalink": "http://www.hindu.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam"
                }
            ];

            let expectedFeeds = [

                {
                    "_id": "http://www.theguardian.com/world/picture/guid1",
                    "type": "description",
                    "docType": "feed",
                    "sourceId": sourceId,
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": ["Nov 5 2015    16:51:20"],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest"
                },

                {
                    "_id": "http://www.theguardian.com/world/picture/guid2",
                    "type": "description",
                    "docType": "feed",
                    "sourceId": sourceId,
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest"
                }
            ];
            let newFeeds = CategoryDocument.getNewFeedDocuments(sourceId, feeds);
            expect(newFeeds).to.deep.equal(expectedFeeds);
        });

        it("should return feeds with the desired format of type imagecontent", ()=> {
            let sourceId = "sourceId";
            let feeds = [
                {
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "description": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "summary": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "date": null,
                    "pubdate": null,
                    "pubDate": null,
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "guid": "http://www.theguardian.com/world/picture/guid1",
                    "author": "Tran Van Tuy",
                    "comments": null,
                    "origlink": null,
                    "image": {},
                    "source": {},
                    "categories": [
                        "Vietnam",
                        "World news",
                        "Asia Pacific"
                    ],
                    "enclosures": [{
                        "url": "http://www.abcd.com",
                        "type": "image/jpeg"
                    }],
                    "permalink": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam"
                }
            ];

            let expectedFeeds = [
                {
                    "_id": "http://www.theguardian.com/world/picture/guid1",
                    "type": "imagecontent",
                    "docType": "feed",
                    "sourceId": sourceId,
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "url": "http://www.abcd.com"
                }
            ];
            let newFeeds = CategoryDocument.getNewFeedDocuments(sourceId, feeds);
            expect(newFeeds).to.deep.equal(expectedFeeds);
        });

        it("should return feeds with the desired format of type gallery", ()=> {
            let sourceId = "sourceId";
            let feeds = [
                {
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "description": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "summary": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "date": null,
                    "pubdate": null,
                    "pubDate": null,
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "guid": "http://www.theguardian.com/world/picture/guid1",
                    "author": "Tran Van Tuy",
                    "comments": null,
                    "origlink": null,
                    "image": {},
                    "source": {},
                    "categories": [
                        "Vietnam",
                        "World news",
                        "Asia Pacific"
                    ],
                    "enclosures": [
                        {
                            "url": "http://www.abcd.com",
                            "type": "image/jpeg"
                        },
                        {
                            "url": "http://www.efgh.com",
                            "type": "image/jpeg"
                        }],
                    "permalink": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam"
                }
            ];

            let expectedFeeds = [
                {
                    "_id": "http://www.theguardian.com/world/picture/guid1",
                    "type": "gallery",
                    "docType": "feed",
                    "sourceId": sourceId,
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "images": [
                        {
                            "type": "image/jpeg",
                            "url": "http://www.abcd.com"
                        },
                        {
                            "type": "image/jpeg",
                            "url": "http://www.efgh.com"
                        }
                    ]
                }
            ];
            let newFeeds = CategoryDocument.getNewFeedDocuments(sourceId, feeds);
            expect(newFeeds).to.deep.equal(expectedFeeds);
        });

        it("should throw an error if the sourceId is empty", () => {
            let newFeedDocumentCallback = function() {
                CategoryDocument.getNewFeedDocuments("", [{ "id": 1 }]);
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

