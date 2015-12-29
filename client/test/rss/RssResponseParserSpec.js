/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import RssResponseParser from "../../src/js/rss/RssResponseParser.js";
import { assert, expect } from "chai";

describe("RssResponseParser", () => {
    describe("parseFeeds", ()=> {
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
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
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
                    "link": "http://www.hindu.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest"
                }
            ];
            let newFeeds = RssResponseParser.parseFeeds(sourceId, feeds);
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
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
                    "feedType": "rss",
                    "content": "<p>Photographs from the Eyewitness series</p> <a href=\"http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam\">Continue reading...</a>",
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "url": "http://www.abcd.com"
                }
            ];
            let newFeeds = RssResponseParser.parseFeeds(sourceId, feeds);
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
                    "link": "http://www.theguardian.com/world/picture/2015/nov/05/eyewitness-cgap-photography-contest-winners-vietnam",
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
            let newFeeds = RssResponseParser.parseFeeds(sourceId, feeds);
            expect(newFeeds).to.deep.equal(expectedFeeds);
        });

        it("should throw an error if the sourceId is empty", () => {
            let newFeedDocumentCallback = function() {
                RssResponseParser.parseFeeds("", [{ "id": 1 }]);
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });

        it("should throw an error if the feeds is empty", () => {
            let newFeedDocumentCallback = function() {
                RssResponseParser.parseFeeds("test", []);
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });

        it("should throw an error if the feeds is undefined", () => {
            let newFeedDocumentCallback = function() {
                RssResponseParser.parseFeeds("test");
            };
            assert.throw(newFeedDocumentCallback, "source id or feeds can not be empty");
        });
    });
});

