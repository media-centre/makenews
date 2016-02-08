/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import RssFeeds from "../../src/js/rss/RssFeeds.js";
import RssDb from "../../src/js/rss/RssDb.js";
import { assert } from "chai";
import sinon from "sinon";

describe("RssFeeds", () => {
    let sandbox = null;
    beforeEach("RssFeeds", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("RssFeeds", () => {
        sandbox.restore();
    });

    describe("save", ()=> {
        let sourceId = "sourceId";

        it("should save feeds with the desired format of description type", (done)=> {
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
                    "postedDate": "2015-11-05T11:21:20+00:00",
                    "tags": [""],
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
                    "postedDate": null,
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest"
                }
            ];
            let RssDbAddRssFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
            RssDbAddRssFeedsMock.withArgs(expectedFeeds).returns(Promise.resolve("success"));
            let rssFeeds = new RssFeeds(feeds);
            rssFeeds.parse();
            rssFeeds.save(sourceId).then(response => {
                assert.strictEqual("success", response);
                RssDbAddRssFeedsMock.verify();
                done();
            });
        });

        it("should return feeds with the desired format of type imagecontent", (done)=> {
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
                    "postedDate": null,
                    "tags": [""],
                    "title": "Eyewitness: Vietnam in the CGAP photography contest",
                    "url": "http://www.abcd.com"
                }
            ];
            let RssDbAddRssFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
            RssDbAddRssFeedsMock.withArgs(expectedFeeds).returns(Promise.resolve("success"));
            let rssFeeds = new RssFeeds(feeds);
            rssFeeds.parse();
            rssFeeds.save(sourceId).then(response => {
                assert.strictEqual("success", response);
                RssDbAddRssFeedsMock.verify();
                done();
            });
        });

        it("should return feeds with the desired format of type gallery", (done)=> {
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
                    "postedDate": null,
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
            let RssDbAddRssFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
            RssDbAddRssFeedsMock.withArgs(expectedFeeds).returns(Promise.resolve("success"));
            let rssFeeds = new RssFeeds(feeds);
            rssFeeds.parse();
            rssFeeds.save(sourceId).then(response => {
                assert.strictEqual("success", response);
                RssDbAddRssFeedsMock.verify();
                done();
            });
        });

        it("should throw an error if the sourceId is empty while saving", (done) => {
            let feeds = [];
            let rssFeeds = new RssFeeds(feeds);
            rssFeeds.save().catch(error => {
                assert.strictEqual(error, "source id can not be empty");
                done();
            });
        });

        it("should throw an error if the feeds is undefined", () => {
            let rssFeeds = function() {
                return new RssFeeds();
            };
            assert.throw(rssFeeds, "feeds can not be null");
        });
    });
});

