/* eslint max-nested-callbacks:0, callback-return:0, no-undefined:0 */
import AjaxClient from "../../src/js/utils/AjaxClient";
import SourceDb from "../../src/js/config/db/SourceDb";
import PouchClient from "../../src/js/db/PouchClient";
import RefreshFeedsHandler from "../../src/js/surf/RefreshFeedsHandler";
import RssRequestHandler from "../../src/js/rss/RssRequestHandler";
import RssDb from "../../src/js/rss/RssDb";
import FacebookRequestHandler from "../../src/js/facebook/FacebookRequestHandler";
import FacebookDb from "../../src/js/facebook/FacebookDb";
import TwitterRequestHandler from "../../src/js/twitter/TwitterRequestHandler";
import TwitterDb from "../../src/js/twitter/TwitterDb";
import RssFeeds from "../../src/js/rss/RssFeeds";
import DateTimeUtil from "../../src/js/utils/DateTimeUtil";
import AppWindow from "../../src/js/utils/AppWindow";
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
        let categoryDbMock = sandbox.stub(SourceDb, "fetchSourceConfigurationBySourceType");
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

            SourceDb.fetchSourceConfigurationBySourceType.restore();
        });

        it("should send batch request based on the sourceUrlsMap", () =>{
            let categoryDbStub = sinon.stub(SourceDb, "fetchSourceConfigurationBySourceType");

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
        let fbRequestHandlerStub = null, fbDbStub = null, constructDataMock = null, sandbox = null;
        beforeEach("before", ()=> {
            sandbox = sinon.sandbox.create();
            fbRequestHandlerStub = sandbox.stub(FacebookRequestHandler, "getBatchPosts");
            fbDbStub = sandbox.stub(FacebookDb, "addFacebookFeeds");
        });
        afterEach("after", ()=> {
            sandbox.restore();
        });

        it("should update the progress percentage on success of updation", (done) => {
            let counter = 0, percentageProgress = 25;
            displayAllFeedsAsync = (percentage) => {
                counter += 1;  //eslint-disable-line no-magic-numbers
                assert.strictEqual(percentage, counter * percentageProgress);
                let maxCounterValue = 4;
                if(counter === maxCounterValue) {
                    done();
                }
            };
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

            fbRequestHandlerStub.withArgs({ "data": postData }).returns(Promise.resolve(fbFeedMap));
            fbDbStub.returns(Promise.resolve());
            let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);

            constructDataMock = sandbox.mock(refreshFeedsHandler).expects("_constructRequestData");
            constructDataMock.returns({ "data": postData });
            refreshFeedsHandler.totalNumberOfUrls = 4;
            refreshFeedsHandler._handleFacebookBatch(fbUrls);
        });
    });

    describe("_handleRssBatch", ()=> {
        describe("creation of feeds", () => {
            let rssRequestHandlerMock = null, rssFeedsSaveStub = null, rssFeedsParseStub = null, rssFeeds = null, sandbox = null, refreshFeedHandler = null, constructDataMock = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                rssFeeds = new RssFeeds([]);

                sandbox.stub(RssFeeds, "instance").returns(rssFeeds);
                rssFeedsParseStub = sandbox.stub(rssFeeds, "parse").returns(true);
                rssFeedsSaveStub = sandbox.stub(rssFeeds, "save").returns(Promise.resolve({ "id": "1" }));
                rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("fetchBatchRssFeeds");
                refreshFeedHandler = new RefreshFeedsHandler();
                constructDataMock = sandbox.mock(refreshFeedHandler).expects("_constructRequestData");
            });
            afterEach("after", ()=> {
                assert(rssFeedsParseStub.calledThrice, "parse not called thrice");
                assert(rssFeedsSaveStub.calledThrice, "save not called thrice");
                rssRequestHandlerMock.verify();
                sandbox.restore();
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
                constructDataMock.withArgs(rssUrls).returns({ "data": postData });
                rssRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(rssFeedMap));
                refreshFeedHandler._handleRssBatch(rssUrls);
            });
        });

        describe("_handleRssBatch", ()=> {
            describe("update timestamp", () => {
                let rssRequestHandlerMock = null, addRssFeedsMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null;
                let refreshFeedsHandler = null, constructDataMock = null, sandbox = null;
                beforeEach("before", ()=> {
                    sandbox = sinon.sandbox.create();
                    rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("fetchBatchRssFeeds");
                    addRssFeedsMock = sandbox.mock(RssDb).expects("addRssFeeds");
                    pouchClientGetDocumentMock = sandbox.mock(PouchClient).expects("getDocument");
                    pouchClientUpdateDocumentMock = sandbox.mock(PouchClient).expects("updateDocument");
                    refreshFeedsHandler = new RefreshFeedsHandler();
                    constructDataMock = sandbox.mock(refreshFeedsHandler).expects("_constructRequestData");
                });
                afterEach("after", ()=> {
                    addRssFeedsMock.verify();
                    pouchClientGetDocumentMock.verify();
                    rssRequestHandlerMock.verify();
                    pouchClientUpdateDocumentMock.verify();

                    sandbox.restore();
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
                    constructDataMock.returns({ "data": postData });

                    rssRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(rssFeedMap));
                    addRssFeedsMock.withArgs([]).returns(Promise.resolve());
                    pouchClientGetDocumentMock.withArgs("1").returns(Promise.resolve(urlDocument));
                    pouchClientUpdateDocumentMock.withArgs(urlDocument).returns(Promise.resolve());

                    refreshFeedsHandler._handleRssBatch(rssUrls);
                });
            });
        });

        describe("Handler should update the completion percentage", ()=> {
            let rssRequestHandlerStub = null, rssDbStub = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                rssRequestHandlerStub = sandbox.stub(RssRequestHandler, "fetchBatchRssFeeds");
                rssDbStub = sandbox.stub(RssDb, "addRssFeeds");
            });
            afterEach("after", ()=> {
                sandbox.restore();
            });
            it("should parse the rss feeds", (done)=> {
                let hundredPercentage = 100;
                displayAllFeedsAsync = (percentage) => {
                    assert.strictEqual(percentage, hundredPercentage);
                    done();
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
                let constructDataMock = sandbox.mock(refreshFeedsHandler).expects("_constructRequestData");
                constructDataMock.returns({ "data": postData });
                refreshFeedsHandler.totalNumberOfUrls = 1;
                refreshFeedsHandler._handleRssBatch(rssUrls);
            });
        });
    });
    
    describe("_handleFacebookBatch", ()=> {
        describe("creation of feeds", ()=> {
            let fbRequestHandlerMock = null, fbDbSpy = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                fbRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("getBatchPosts");
                fbDbSpy = sandbox.spy(FacebookDb, "addFacebookFeeds");
            });
            afterEach("after", ()=> {
                let maxCallCount = 2;
                sinon.assert.callCount(fbDbSpy, maxCallCount);
                fbRequestHandlerMock.verify();
                sandbox.restore();
            });
            it("should parse and add facebook feeds", ()=> {
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

                fbRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(fbFeedMap));
                let refreshFeedsHandler = new RefreshFeedsHandler();
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });

        describe("update timestamp", ()=> {
            let fbRequestHandlerMock = null, addFacebookFeedsMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null, sandbox = null;

            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                fbRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("getBatchPosts");
                addFacebookFeedsMock = sandbox.mock(FacebookDb).expects("addFacebookFeeds");
                pouchClientGetDocumentMock = sandbox.mock(PouchClient).expects("getDocument");
                pouchClientUpdateDocumentMock = sandbox.mock(PouchClient).expects("updateDocument");
            });
            afterEach("after", ()=> {
                fbRequestHandlerMock.verify();
                addFacebookFeedsMock.verify();
                pouchClientGetDocumentMock.verify();
                pouchClientUpdateDocumentMock.verify();

                sandbox.restore();
            });
            it("should update latest timestamp post refresh", ()=> {

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

                fbRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(fbFeedMap));
                addFacebookFeedsMock.withArgs(bulkUpdateFeeds).returns(Promise.resolve());
                pouchClientGetDocumentMock.withArgs("1").returns(Promise.resolve(urlDocument));
                pouchClientUpdateDocumentMock.withArgs(urlDocument).returns(Promise.resolve());

                let refreshFeedsHandler = new RefreshFeedsHandler();
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });

        describe("UICallback", ()=> {
            let fbRequestHandlerStub = null, fbDbStub = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                fbRequestHandlerStub = sandbox.stub(FacebookRequestHandler, "getBatchPosts");
                fbDbStub = sandbox.stub(FacebookDb, "addFacebookFeeds");
            });
            afterEach("after", ()=> {
                sandbox.restore();
            });
            it("should parse and add facebook feeds", (done) => {
                uiCallback = () => {
                    done();
                };
                displayAllFeedsAsync = () => {
                    uiCallback();
                };
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

                fbRequestHandlerStub.withArgs({ "data": postData }).returns(Promise.resolve(fbFeedMap));
                fbDbStub.returns(Promise.resolve());
                let refreshFeedsHandler = new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, uiCallback);
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleFacebookBatch(fbUrls);
            });
        });
    });

    describe("_handleTwitterBatch", ()=> {
        describe("creation of feeds", () => {
            let twitterRequestHandlerMock = null, twitterDbSpy = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("fetchBatchTweets");
                twitterDbSpy = sandbox.spy(TwitterDb, "addTweets");
            });
            afterEach("after", ()=> {
                let maxCallCount = 3;
                sinon.assert.callCount(twitterDbSpy, maxCallCount);
                twitterRequestHandlerMock.verify();
                sandbox.restore();
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
                    "2": { "statuses": [
                            { "name": "test name2", "entities": { "hashtags": ["test"] } },
                            { "name": "test name2", "entities": { "hashtags": ["test"] } }
                    ] },
                    "3": { "statuses": [
                            { "name": "test name", "entities": { "hashtags": ["test"] } },
                            { "name": "test name", "entities": { "hashtags": ["test"] } }
                    ] }
                };

                twitterRequestHandlerMock.withArgs({ "data": postData }).returns(Promise.resolve(twitterFeedMap));
                let refreshFeedsHandler = new RefreshFeedsHandler();
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });

        describe("update the timestamp", () => {
            let twitterRequestHandlerMock = null, twitterDbMock = null, pouchClientGetDocumentMock = null, pouchClientUpdateDocumentMock = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("fetchBatchTweets");
                twitterDbMock = sandbox.mock(TwitterDb).expects("addTweets");
                pouchClientGetDocumentMock = sandbox.mock(PouchClient).expects("getDocument");
                pouchClientUpdateDocumentMock = sandbox.mock(PouchClient).expects("updateDocument");
            });
            afterEach("after", ()=> {
                twitterRequestHandlerMock.verify();
                twitterDbMock.verify();
                pouchClientGetDocumentMock.verify();
                pouchClientUpdateDocumentMock.verify();

                sandbox.restore();
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
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });
        describe("UICallback", ()=> {
            let twitterRequestHandlerStub = null, twitterDbStub = null, sandbox = null;
            beforeEach("before", ()=> {
                sandbox = sinon.sandbox.create();
                twitterRequestHandlerStub = sandbox.stub(TwitterRequestHandler, "fetchBatchTweets");
                twitterDbStub = sandbox.stub(TwitterDb, "addTweets");
            });
            afterEach("after", ()=> {
                sandbox.restore();
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
                sandbox.mock(refreshFeedsHandler).expects("_constructRequestData").returns({ "data": postData });
                refreshFeedsHandler._handleTwitterBatch(twitterUrls);
            });
        });
    });

    it("should handle fetching of urls failure", () => {
        let sandbox = sinon.sandbox.create();
        let pouchClientMock = sandbox.mock(PouchClient).expects("fetchDocuments");
        pouchClientMock.returns(Promise.reject("fetch failure"));


        new RefreshFeedsHandler().fetchAllSourceUrls().catch((error) => {
            expect(error).to.eq("fetch failure");
        });
        sandbox.restore();
    });

    xit("should handle ajax request failure", () => {
        let sandbox = sinon.sandbox.create();
        let urls = [{
            "sourceType": "twitter",
            "url": "",
            "status": "valid",
            "latestFeedTimestamp": "Jan 6, 2016 9:21 AM"
        }];
        let postData = {
            "data": [{ "source": "twitter", "url": "" }]
        };
        let categoryDbMock = sandbox.stub(SourceDb, "fetchSourceConfigurationBySourceType");
        categoryDbMock.returns(Promise.resolve(urls));
        let ajaxMock = new AjaxClient("/fetch-feeds");
        let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
        ajaxInstanceMock.withArgs("/fetch-feeds").returns(ajaxMock);
        let ajaxPostMock = sandbox.mock(ajaxMock).expects("post");
        ajaxPostMock.withExactArgs({}, postData).returns(Promise.reject("request error"));

        return Promise.resolve(new RefreshFeedsHandler().fetchAllSourceUrls()).catch((error) => {
            expect(error).to.eq("request error");
            sandbox.restore();
        });
    });

    describe("_constructRequestData", () => {
        let sandbox = null, dateMock = null;
        beforeEach("_constructRequestData", () => {
            sandbox = sinon.sandbox.create();
            dateMock = sandbox.stub(Date, "parse");
            let appwindow = new AppWindow();
            sandbox.stub(AppWindow, "instance").returns(appwindow);
            sandbox.stub(appwindow, "get").withArgs("numberOfDaysToBackUp").returns(2); //eslint-disable-line no-magic-numbers
        });

        afterEach("_constructRequestData", () => {
            sandbox.restore();
        });

        it("should return the same timestamp if it is newer than past two days", () => {

            let sourceTime = 1461846720099, olderTimeToFetchData = 1461846720000;
            dateMock.withArgs("Thu, Apr 28, 2016 12:32 PM").returns(sourceTime);
            dateMock.returns(olderTimeToFetchData);

            let sources = [{ "url": "twitterUrl", "latestFeedTimestamp": "Thu, Apr 28, 2016 12:32 PM", "_id": "1" }];
            let expectedOutput = { "data": [{ "timestamp": "Thu, Apr 28, 2016 12:32 PM", "url": "twitterUrl", "id": "1" }] };

            let constructedSources = new RefreshFeedsHandler()._constructRequestData(sources);
            assert.deepEqual(constructedSources, expectedOutput);

        });

        it("should return the two days before timestamp if it is older than past two days", () => {
            let dateTimeUtilStub = sandbox.stub(DateTimeUtil, "getCurrentTimeStamp");
            dateTimeUtilStub.returns({
                "subtract": () => {
                    return {
                        "toISOString": () => {
                            return "2016-04-26T09:37:01.666Z";
                        }
                    };
                }
            });
            let sourceTime = 1461846720000, olderTimeToFetchData = 1461846720099;
            dateMock.withArgs("Thu, Apr 22, 2016 12:32 PM").returns(sourceTime);
            dateMock.returns(olderTimeToFetchData);

            let sources = [{ "url": "twitterUrl", "latestFeedTimestamp": "Thu, Apr 22, 2016 12:32 PM", "_id": "1" }];
            let expectedOutput = { "data": [{ "timestamp": "2016-04-26T09:37:01.666Z", "url": "twitterUrl", "id": "1" }] };

            let constructedSources = new RefreshFeedsHandler()._constructRequestData(sources);
            assert.deepEqual(constructedSources, expectedOutput);
        });
    });
});
