/* eslint max-nested-callbacks:0, callback-return:0, no-undefined:0 */
"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import PouchClient from "../../src/js/db/PouchClient.js";
import RefreshFeedsHandler from "../../src/js/surf/RefreshFeedsHandler.js";
import RssRequestHandler from "../../src/js/rss/RssRequestHandler.js";
import RssDb from "../../src/js/rss/RssDb.js";
import FacebookRequestHandler from "../../src/js/facebook/FacebookRequestHandler.js";
import FacebookDb from "../../src/js/facebook/FacebookDb.js";
import TwitterRequestHandler from "../../src/js/twitter/TwitterRequestHandler.js";
import TwitterDb from "../../src/js/twitter/TwitterDb.js";
import EnvironmentConfig from "../../src/js/EnvironmentConfig.js";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("RefreshFeedsHandler", () => {
    let dispatch = null, displayAllFeedsAsync = null, uiCallback = null;
    before("before", () => {
        dispatch = (action) => {
            action(uiCallback);
        };
        displayAllFeedsAsync = (callback) => {
            callback();
        };
        uiCallback = () => {};
    });
    it("should fetchSourcesByType", () =>{
        let sandbox = sinon.sandbox.create();
        let categoryDbMock = sandbox.stub(CategoryDb, "fetchSourceConfigurationBySourceType");
        let twitterUrls = [
            {
                "sourceType": "rss",
                "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
            }];
        let fbUrls = [
            {
                "sourceType": "facebook",
                "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
            }];
        let rssUrls = [
            {
                "sourceType": "rss",
                "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
            }];

        let result = {
            "twitter": twitterUrls,
            "facebook": fbUrls,
            "rss": rssUrls
        };

        categoryDbMock.withArgs("twitter").returns(Promise.resolve(twitterUrls));
        categoryDbMock.withArgs("facebook").returns(Promise.resolve(fbUrls));
        categoryDbMock.withArgs("rss").returns(Promise.resolve(rssUrls));

        let refreshFeedsHandler = new RefreshFeedsHandler();
        return refreshFeedsHandler.fetchAllSourceUrls().then(() => {
            expect(refreshFeedsHandler.sourceUrlsMap).to.deep.eq(result);
            sandbox.restore();
        });
    });

    describe("handleBatchRequests", () => {
        let rssRequestHandlerMock = null, fbRequestHandlerMock = null, twitterRequestHandlerMock = null;
        beforeEach("before", () => {
            rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("fetchBatchRssFeeds").twice().returns(Promise.resolve());
            fbRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("getBatchPosts").thrice().returns(Promise.resolve());
            twitterRequestHandlerMock = sinon.mock(TwitterRequestHandler).expects("fetchBatchTweets").twice().returns(Promise.resolve());
        });
        afterEach("after", () => {
            rssRequestHandlerMock.verify();
            fbRequestHandlerMock.verify();
            twitterRequestHandlerMock.verify();

            RssRequestHandler.fetchBatchRssFeeds.restore();
            FacebookRequestHandler.getBatchPosts.restore();
            TwitterRequestHandler.fetchBatchTweets.restore();

            CategoryDb.fetchSourceConfigurationBySourceType.restore();
        });

        it("should send batch request based on the sourceUrlsMap", () =>{
            let categoryDbStub = sinon.stub(CategoryDb, "fetchSourceConfigurationBySourceType");

            let rssUrls = [
                { "url": "rssUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                { "url": "rssUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                { "url": "rssUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                { "url": "rssUrl4", "latestFeedTimestamp": "1234", "_id": "4" },
                { "url": "rssUrl5", "latestFeedTimestamp": "1234", "_id": "5" },
                { "url": "rssUrl6", "latestFeedTimestamp": "1234", "_id": "6" },
                { "url": "rssUrl7", "latestFeedTimestamp": "1234", "_id": "7" },
                { "url": "rssUrl8", "latestFeedTimestamp": "1234", "_id": "8" },
                { "url": "rssUrl9", "latestFeedTimestamp": "1234", "_id": "9" }
            ];
            let fbUrls = [
                { "url": "fbUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                { "url": "fbUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                { "url": "fbUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                { "url": "fbUrl4", "latestFeedTimestamp": "1234", "_id": "4" },
                { "url": "fbUrl5", "latestFeedTimestamp": "1234", "_id": "5" },
                { "url": "fbUrl6", "latestFeedTimestamp": "1234", "_id": "6" },
                { "url": "fbUrl7", "latestFeedTimestamp": "1234", "_id": "7" },
                { "url": "fbUrl8", "latestFeedTimestamp": "1234", "_id": "8" },
                { "url": "fbUrl9", "latestFeedTimestamp": "1234", "_id": "9" },
                { "url": "fbUrl10", "latestFeedTimestamp": "1234", "_id": "10" },
                { "url": "fbUrl11", "latestFeedTimestamp": "1234", "_id": "11" }
            ];
            let twitterUrls = [
                { "url": "twitterUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                { "url": "twitterUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                { "url": "twitterUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                { "url": "twitterUrl4", "latestFeedTimestamp": "1234", "_id": "4" },
                { "url": "twitterUrl5", "latestFeedTimestamp": "1234", "_id": "5" },
                { "url": "twitterUrl6", "latestFeedTimestamp": "1234", "_id": "6" },
                { "url": "twitterUrl7", "latestFeedTimestamp": "1234", "_id": "7" },
                { "url": "twitterUrl8", "latestFeedTimestamp": "1234", "_id": "8" },
                { "url": "twitterUrl9", "latestFeedTimestamp": "1234", "_id": "9" }
            ];

            categoryDbStub.withArgs("twitter").returns(Promise.resolve(twitterUrls));
            categoryDbStub.withArgs("facebook").returns(Promise.resolve(fbUrls));
            categoryDbStub.withArgs("rss").returns(Promise.resolve(rssUrls));

            let refreshFeedsHandler = new RefreshFeedsHandler();
            refreshFeedsHandler.handleBatchRequests(dispatch, displayAllFeedsAsync, uiCallback);
        });
    });

    describe("refreshCompletionPercentage", () => {
        let fbRequestHandlerStub = null, fbDbStub = null;
        beforeEach("before", ()=> {
            fbRequestHandlerStub = sinon.stub(FacebookRequestHandler, "getBatchPosts");
            fbDbStub = sinon.stub(FacebookDb, "addFacebookFeeds");
        });
        afterEach("after", ()=> {
            FacebookRequestHandler.getBatchPosts.restore();
            FacebookDb.addFacebookFeeds.restore();
        });

        it("should update the progress percentage on success of updation", (done) => {
            let counter = 0, percentageProgress = 25;
            displayAllFeedsAsync = (callback, percentage) => {
                counter += 1;
                assert.strictEqual(percentage, counter * percentageProgress);
                callback();
                let maxCounterValue = 4;
                if(counter === maxCounterValue) {
                    done();
                }
            };
            let token = EnvironmentConfig.instance().get("facebookAccessToken");
            let fbUrls = [
                { "url": "fbUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                { "url": "fbUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                { "url": "fbUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                { "url": "fbUrl4", "latestFeedTimestamp": "1234", "_id": "4" }
            ];
            let postData = [
                { "url": "fbUrl1", "timestamp": "1234", "id": "1" },
                { "url": "fbUrl2", "timestamp": "1234", "id": "2" },
                { "url": "fbUrl3", "timestamp": "1234", "id": "3" },
                { "url": "fbUrl4", "timestamp": "1234", "id": "4" }
            ];

            let fbFeedMap = {
                "posts": {
                    "1": [{ "name": "test name1", "id": "1" }],
                    "2": [{ "name": "test name2", "id": "2" }],
                    "3": [{ "name": "test name3", "id": "3" }],
                    "4": [{ "name": "test name4", "id": "4" }]
                }
            };

            fbRequestHandlerStub.withArgs(token, { "data": postData }).returns(Promise.resolve(fbFeedMap));
            fbDbStub.returns(Promise.resolve());
            let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);
            refreshFeedsHandler.totalNumberOfUrls = 4;
            refreshFeedsHandler._handleFacebookBatch(fbUrls);
        });
    });

    describe("_handleRssBatch", ()=> {
        describe("creation of feeds", () => {
            let rssRequestHandlerMock = null, rssDbSpy = null;
            beforeEach("before", ()=> {
                rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("fetchBatchRssFeeds");
                rssDbSpy = sinon.spy(RssDb, "addRssFeeds");
            });
            afterEach("after", ()=> {
                let maxCallCount = 3;
                sinon.assert.callCount(rssDbSpy, maxCallCount);
                rssRequestHandlerMock.verify();
                RssRequestHandler.fetchBatchRssFeeds.restore();
                RssDb.addRssFeeds.restore();
            });
            it("should parse the rss feeds", ()=> {
                let rssUrls = [
                    { "url": "rssUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                    { "url": "rssUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                    { "url": "rssUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                    { "url": "rssUrl4", "latestFeedTimestamp": "1234", "_id": "4" },
                    { "url": "rssUrl5", "latestFeedTimestamp": "1234", "_id": "5" }
                ];
                let postData = [
                    { "url": "rssUrl1", "timestamp": "1234", "id": "1" },
                    { "url": "rssUrl2", "timestamp": "1234", "id": "2" },
                    { "url": "rssUrl3", "timestamp": "1234", "id": "3" },
                    { "url": "rssUrl4", "timestamp": "1234", "id": "4" },
                    { "url": "rssUrl5", "timestamp": "1234", "id": "5" }
                ];

                let rssFeedMap = {
                    "1": {
                        "items": [
                            { "name": "test name1" },
                            { "name": "test name1" }
                        ]
                    },
                    "2": {
                        "items": [
                            { "name": "test name2" },
                            { "name": "test name2" }
                        ]
                    },
                    "3": {
                        "items": [
                            { "name": "test name" },
                            { "name": "test name" }
                        ]
                    }
                };

                rssRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(rssFeedMap));
                let refreshFeedsHandler = new RefreshFeedsHandler();
                refreshFeedsHandler._handleRssBatch(rssUrls);
            });
        });

        describe("_handleRssBatch", ()=> {
            describe("update timestamp", () => {
                let rssRequestHandlerMock = null, addRssFeedsMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null;
                beforeEach("before", ()=> {
                    rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("fetchBatchRssFeeds");
                    addRssFeedsMock = sinon.mock(RssDb).expects("addRssFeeds");
                    pouchClientGetDocumentMock = sinon.mock(PouchClient).expects("getDocument");
                    pouchClientUpdateDocumentMock = sinon.mock(PouchClient).expects("updateDocument");
                });
                afterEach("after", ()=> {
                    addRssFeedsMock.verify();
                    pouchClientGetDocumentMock.verify();
                    rssRequestHandlerMock.verify();
                    pouchClientUpdateDocumentMock.verify();

                    RssDb.addRssFeeds.restore();
                    RssRequestHandler.fetchBatchRssFeeds.restore();
                    PouchClient.getDocument.restore();
                    PouchClient.updateDocument.restore();
                });
                it("should update latest timestamp post refresh", ()=> {
                    let urlDocument = {
                        "docType": "source",
                        "id": "1",
                        "latestFeedTimestamp": "2016-01-16T07:37:48+00:00",
                        "sourceType": "rss",
                        "url": "www.google.com/rss"
                    };

                    let rssUrls = [
                        { "url": "rssUrl1", "latestFeedTimestamp": "2016-01-16T07:36:17+00:00", "_id": "1" }
                    ];
                    let postData = [
                        { "url": "rssUrl1", "timestamp": "2016-01-16T07:36:17+00:00", "id": "1" }
                    ];

                    let feed = {
                        "_id": undefined,
                        "docType": "feed",
                        "sourceId": "1",
                        "type": "description",
                        "title": "test name1",
                        "link": undefined,
                        "feedType": "rss",
                        "content": undefined,
                        "postedDate": null,
                        "tags": [""]
                    };
                    let feed1 = {
                        "_id": undefined,
                        "docType": "feed",
                        "sourceId": "1",
                        "type": "description",
                        "title": "test name1",
                        "link": undefined,
                        "feedType": "rss",
                        "content": undefined,
                        "postedDate": "2016-01-16T07:37:48+00:00",
                        "tags": [""]
                    };

                    let rssFeedMap = {
                        "1": {
                            "items": [feed1]
                        }
                    };

                    rssRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(rssFeedMap));
                    addRssFeedsMock.withArgs([feed]).returns(Promise.resolve());
                    pouchClientGetDocumentMock.withArgs("1").returns(Promise.resolve(urlDocument));
                    pouchClientUpdateDocumentMock.withArgs(urlDocument).returns(Promise.resolve());

                    let refreshFeedsHandler = new RefreshFeedsHandler();
                    refreshFeedsHandler._handleRssBatch(rssUrls);
                });
            });
        });

        describe("UICallback", ()=> {
            let rssRequestHandlerStub = null, rssDbStub = null;
            beforeEach("before", ()=> {
                rssRequestHandlerStub = sinon.stub(RssRequestHandler, "fetchBatchRssFeeds");
                rssDbStub = sinon.stub(RssDb, "addRssFeeds");
            });
            afterEach("after", ()=> {
                RssRequestHandler.fetchBatchRssFeeds.restore();
                RssDb.addRssFeeds.restore();
            });
            it("should parse the rss feeds", (done)=> {
                let hundredPercentage = 100;
                uiCallback = () => {
                    done();
                };
                displayAllFeedsAsync = (callback, percentage) => {
                    assert.strictEqual(percentage, hundredPercentage);
                    callback();
                };
                let rssUrls = [{ "url": "rssUrl1", "latestFeedTimestamp": "1234", "_id": "1" }];
                let postData = [{ "url": "rssUrl1", "timestamp": "1234", "id": "1" }];

                let rssFeedMap = {
                    "1": {
                        "items": [
                            { "name": "test name1" }
                        ]
                    }
                };

                rssRequestHandlerStub.withArgs({ "data": postData }).returns(Promise.resolve(rssFeedMap));
                rssDbStub.returns(Promise.resolve());
                let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);
                refreshFeedsHandler.totalNumberOfUrls = 1;
                refreshFeedsHandler._handleRssBatch(rssUrls);
            });
        });
    });
    
    describe("_handleFacebookBatch", ()=> {
        describe("creation of feeds", ()=> {
            let fbRequestHandlerMock = null, fbDbSpy = null;
            beforeEach("before", ()=> {
                fbRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("getBatchPosts");
                fbDbSpy = sinon.spy(FacebookDb, "addFacebookFeeds");
            });
            afterEach("after", ()=> {
                let maxCallCount = 2;
                sinon.assert.callCount(fbDbSpy, maxCallCount);
                fbRequestHandlerMock.verify();
                FacebookRequestHandler.getBatchPosts.restore();
                FacebookDb.addFacebookFeeds.restore();
            });
            it("should parse and add facebook feeds", ()=> {
                let token = EnvironmentConfig.instance().get("facebookAccessToken");
                let fbUrls = [
                    { "url": "fbUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                    { "url": "fbUrl2", "latestFeedTimestamp": "1234", "_id": "2" }
                ];
                let postData = [
                    { "url": "fbUrl1", "timestamp": "1234", "id": "1" },
                    { "url": "fbUrl2", "timestamp": "1234", "id": "2" }
                ];

                let fbFeedMap = {
                    "posts": {
                        "1": [{ "name": "test name1", "id": "1" }],
                        "2": [{ "name": "test name2", "id": "2" }]
                    }
                };

                fbRequestHandlerMock.withArgs(token, { "data": postData }).returns(Promise.resolve(fbFeedMap));
                let refreshFeedsHandler = new RefreshFeedsHandler();
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });

        describe("update timestamp", ()=> {
            let fbRequestHandlerMock = null, addFacebookFeedsMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null;

            beforeEach("before", ()=> {
                fbRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("getBatchPosts");
                addFacebookFeedsMock = sinon.mock(FacebookDb).expects("addFacebookFeeds");
                pouchClientGetDocumentMock = sinon.mock(PouchClient).expects("getDocument");
                pouchClientUpdateDocumentMock = sinon.mock(PouchClient).expects("updateDocument");
            });
            afterEach("after", ()=> {
                fbRequestHandlerMock.verify();
                addFacebookFeedsMock.verify();
                pouchClientGetDocumentMock.verify();
                pouchClientUpdateDocumentMock.verify();

                FacebookRequestHandler.getBatchPosts.restore();
                FacebookDb.addFacebookFeeds.restore();
                PouchClient.getDocument.restore();
                PouchClient.updateDocument.restore();
            });
            it("should update latest timestamp post refresh", ()=> {
                let token = EnvironmentConfig.instance().get("facebookAccessToken");

                let urlDocument = {
                    "docType": "source",
                    "id": "1",
                    "latestFeedTimestamp": "2016-01-16T07:37:48+00:00",
                    "sourceType": "facebook",
                    "url": "www.facebook.com/myposts"
                };

                let feed = {
                    "_id": undefined,
                    "id": "1",
                    "docType": "feed",
                    "sourceId": "1",
                    "type": "description",
                    "title": "test name1",
                    "link": undefined,
                    "feedType": "facebook",
                    "content": undefined,
                    "postedDate": "2016-01-16T07:37:48+00:00",
                    "tags": [""]
                };

                let fbUrls = [
                    { "url": "fbUrl1", "latestFeedTimestamp": "2016-01-16T07:36:17+00:00", "_id": "1" }
                ];
                let postData = [
                    { "url": "fbUrl1", "timestamp": "2016-01-16T07:36:17+00:00", "id": "1" }
                ];

                let fbFeedMap = {
                    "posts": {
                        "1": [feed]
                    }
                };
                let bulkUpdateFeeds = [
                    {
                        "_id": "1",
                        "docType": "feed",
                        "sourceId": "1",
                        "type": "description",
                        "title": "",
                        "feedType": "facebook",
                        "link": "https://www.facebook.com/1/posts/undefined",
                        "content": "",
                        "postedDate": null,
                        "tags": []
                    }];

                fbRequestHandlerMock.withArgs(token, { "data": postData }).returns(Promise.resolve(fbFeedMap));
                addFacebookFeedsMock.withArgs(bulkUpdateFeeds).returns(Promise.resolve());
                pouchClientGetDocumentMock.withArgs("1").returns(Promise.resolve(urlDocument));
                pouchClientUpdateDocumentMock.withArgs(urlDocument).returns(Promise.resolve());

                let refreshFeedsHandler = new RefreshFeedsHandler();
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });

        describe("UICallback", ()=> {
            let fbRequestHandlerStub = null, fbDbStub = null;
            beforeEach("before", ()=> {
                fbRequestHandlerStub = sinon.stub(FacebookRequestHandler, "getBatchPosts");
                fbDbStub = sinon.stub(FacebookDb, "addFacebookFeeds");
            });
            afterEach("after", ()=> {
                FacebookRequestHandler.getBatchPosts.restore();
                FacebookDb.addFacebookFeeds.restore();
            });
            it("should parse and add facebook feeds", (done) => {
                uiCallback = () => {
                    done();
                };
                displayAllFeedsAsync = () => {
                    uiCallback();
                };
                let token = EnvironmentConfig.instance().get("facebookAccessToken");
                let fbUrls = [
                    { "url": "fbUrl2", "latestFeedTimestamp": "1234", "_id": "2" }
                ];
                let postData = [
                    { "url": "fbUrl2", "timestamp": "1234", "id": "2" }
                ];

                let fbFeedMap = {
                    "posts": {
                        "2": [{ "name": "test name2", "id": "2" }]
                    }
                };

                fbRequestHandlerStub.withArgs(token, { "data": postData }).returns(Promise.resolve(fbFeedMap));
                fbDbStub.returns(Promise.resolve());
                let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });
    });

    describe("_handleTwitterBatch", ()=> {
        describe("creation of feeds", () => {
            let twitterRequestHandlerMock = null, twitterDbSpy = null;
            beforeEach("before", ()=> {
                twitterRequestHandlerMock = sinon.mock(TwitterRequestHandler).expects("fetchBatchTweets");
                twitterDbSpy = sinon.spy(TwitterDb, "addTweets");
            });
            afterEach("after", ()=> {
                let maxCallCount = 3;
                sinon.assert.callCount(twitterDbSpy, maxCallCount);
                twitterRequestHandlerMock.verify();
                TwitterRequestHandler.fetchBatchTweets.restore();
                TwitterDb.addTweets.restore();
            });
            it("should parse the twitter feeds", ()=> {
                let twitterUrls = [
                    { "url": "twitterUrl1", "latestFeedTimestamp": "1234", "_id": "1" },
                    { "url": "twitterUrl2", "latestFeedTimestamp": "1234", "_id": "2" },
                    { "url": "twitterUrl3", "latestFeedTimestamp": "1234", "_id": "3" },
                    { "url": "twitterUrl4", "latestFeedTimestamp": "1234", "_id": "4" },
                    { "url": "twitterUrl5", "latestFeedTimestamp": "1234", "_id": "5" }
                ];
                let postData = [
                    { "url": "twitterUrl1", "timestamp": "1234", "id": "1" },
                    { "url": "twitterUrl2", "timestamp": "1234", "id": "2" },
                    { "url": "twitterUrl3", "timestamp": "1234", "id": "3" },
                    { "url": "twitterUrl4", "timestamp": "1234", "id": "4" },
                    { "url": "twitterUrl5", "timestamp": "1234", "id": "5" }
                ];

                let twitterFeedMap = {
                    "1": { "statuses": [
                        { "name": "test name1", "entities": { "hashtags": ["test"] } },
                        { "name": "test name1", "entities": { "hashtags": ["test"] } }
                    ] },
                    "2": { "statuses":
                        [
                            { "name": "test name2", "entities": { "hashtags": ["test"] } },
                            { "name": "test name2", "entities": { "hashtags": ["test"] } }
                        ] },
                    "3": { "statuses":
                        [
                            { "name": "test name", "entities": { "hashtags": ["test"] } },
                            { "name": "test name", "entities": { "hashtags": ["test"] } }
                        ] }
                };

                twitterRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(twitterFeedMap));
                let refreshFeedsHandler = new RefreshFeedsHandler();
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });

        describe("update the timestamp", () => {
            let twitterRequestHandlerMock = null, twitterDbMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null;
            beforeEach("before", ()=> {
                twitterRequestHandlerMock = sinon.mock(TwitterRequestHandler).expects("fetchBatchTweets");
                twitterDbMock = sinon.mock(TwitterDb).expects("addTweets");
                pouchClientGetDocumentMock = sinon.mock(PouchClient).expects("getDocument");
                pouchClientUpdateDocumentMock = sinon.mock(PouchClient).expects("updateDocument");
            });
            afterEach("after", ()=> {
                twitterRequestHandlerMock.verify();
                twitterDbMock.verify();
                pouchClientGetDocumentMock.verify();
                pouchClientUpdateDocumentMock.verify();

                TwitterRequestHandler.fetchBatchTweets.restore();
                TwitterDb.addTweets.restore();
                PouchClient.getDocument.restore();
                PouchClient.updateDocument.restore();
            });
            it("should update the latest timestamp post fetch", ()=> {
                let urlDocument = {
                    "docType": "source",
                    "id": "1",
                    "latestFeedTimestamp": "2016-01-16T07:37:48+00:00",
                    "sourceType": "twitter",
                    "url": "@myposts"
                };
                let twitterUrls = [
                    { "url": "twitterUrl1", "latestFeedTimestamp": "2016-01-16T07:36:17+00:00", "_id": "1" }
                ];
                let postData = [
                    { "url": "twitterUrl1", "timestamp": "2016-01-16T07:36:17+00:00", "id": "1" }
                ];

                let feed = {
                    "_id": undefined,
                    "id": "1",
                    "docType": "feed",
                    "sourceId": "1",
                    "type": "description",
                    "title": "test name1",
                    "link": undefined,
                    "feedType": "facebook",
                    "content": undefined,
                    "postedDate": "2016-01-16T07:37:48+00:00",
                    "tags": [""],
                    "entities": { "hashtags": ["test"] }
                };

                let twitterFeedMap = { "1": { "statuses": [feed] } };

                let bulkUpdateFeeds = [
                    {
                        "_id": undefined,
                        "docType": "feed",
                        "sourceId": "1",
                        "type": "description",
                        "feedType": "twitter",
                        "content": undefined,
                        "link": "https://twitter.com/1/status/undefined",
                        "postedDate": null,
                        "tags": [undefined]
                    }
                ];

                twitterRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(twitterFeedMap));
                twitterDbMock.withArgs(bulkUpdateFeeds).returns(Promise.resolve());
                pouchClientGetDocumentMock.withArgs("1").returns(Promise.resolve(urlDocument));
                pouchClientUpdateDocumentMock.withArgs(urlDocument).returns(Promise.resolve());

                let refreshFeedsHandler = new RefreshFeedsHandler();
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });
        describe("UICallback", ()=> {
            let twitterRequestHandlerStub = null, twitterDbStub = null;
            beforeEach("before", ()=> {
                twitterRequestHandlerStub = sinon.stub(TwitterRequestHandler, "fetchBatchTweets");
                twitterDbStub = sinon.stub(TwitterDb, "addTweets");
            });
            afterEach("after", ()=> {
                TwitterRequestHandler.fetchBatchTweets.restore();
            });
            it("should parse and add twitter feed", (done) => {
                uiCallback = () => {
                    done();
                };
                displayAllFeedsAsync = () => {
                    uiCallback();
                };
                let twitterUrls = [
                    { "url": "fbUrl2", "latestFeedTimestamp": "1234", "_id": "2" }
                ];
                let postData = [
                    { "url": "fbUrl2", "timestamp": "1234", "id": "2" }
                ];

                let twitterFeedMap = {
                    "2": { "statuses": [{ "name": "test name2", "id": "2", "entities": { "hashtags": ["test"] } }] }
                };

                twitterRequestHandlerStub.withArgs({ "data": postData }).returns(Promise.resolve(twitterFeedMap));
                twitterDbStub.returns(Promise.resolve());
                let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });
    });

    xit("should handle fetching of urls failure", () => {
        let sandbox = sinon.sandbox.create();
        let categoryDbMock = sandbox.mock(CategoryDb).expects("fetchAllSources");
        categoryDbMock.returns(Promise.reject("fetch failure"));


        return Promise.resolve(RefreshFeedsHandler.fetchSourceConfigurationBySourceType()).catch((error) => {
            expect(error).to.eq("fetch failure");
            sandbox.restore();
        });
    });

    xit("should handle ajax request failure", () => {
        let urls = [{
            "sourceType": "twitter",
            "url": "",
            "status": "valid",
            "latestFeedTimestamp": "Jan 6, 2016 9:21 AM"
        }];
        let postData = {
            "data": [{ "source": "twitter", "url": "" }],
            "facebookAccessToken": EnvironmentConfig.instance().get("facebookAccessToken")
        };
        let sandbox = sinon.sandbox.create();
        let categoryDbMock = sandbox.mock(CategoryDb).expects("fetchAllSources");
        categoryDbMock.returns(Promise.resolve(urls));
        let ajaxMock = new AjaxClient("/fetch-all-feeds-from-all-sources");
        let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/fetch-all-feeds-from-all-sources").returns(ajaxMock);
        let ajaxPostMock = sandbox.mock(ajaxMock).expects("post");
        ajaxPostMock.withExactArgs({}, postData).returns(Promise.reject("request error"));

        return Promise.resolve(RefreshFeedsHandler.fetchLatestFeeds()).catch((error) => {
            expect(error).to.eq("request error");
            sandbox.restore();
        });
    });
});
