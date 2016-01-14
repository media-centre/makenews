/* eslint max-nested-callbacks:0 */
"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import CategoryDb from "../../src/js/config/db/CategoryDb.js";
import RefreshFeedsHandler from "../../src/js/surf/RefreshFeedsHandler.js";
import RssRequestHandler from "../../src/js/rss/RssRequestHandler.js";
import RssDb from "../../src/js/rss/RssDb.js";
import FacebookRequestHandler from "../../src/js/facebook/FacebookRequestHandler.js";
import FacebookDb from "../../src/js/facebook/FacebookDb.js";
import EnvironmentConfig from "../../src/js/EnvironmentConfig.js";
import { expect } from "chai";
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
        let rssRequestHandlerMock = null, fbRequestHandlerMock = null;
        beforeEach("before", () => {
            rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("fetchBatchRssFeeds").twice().returns(Promise.resolve());
            fbRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("getBatchPosts").thrice().returns(Promise.resolve());
        });
        afterEach("after", () => {
            rssRequestHandlerMock.verify();
            fbRequestHandlerMock.verify();

            RssRequestHandler.fetchBatchRssFeeds.restore();
            FacebookRequestHandler.getBatchPosts.restore();

            CategoryDb.fetchSourceConfigurationBySourceType.restore();
        });

        it("should send batch request based on the sourceUrlsMap", () =>{
            let categoryDbStub = sinon.stub(CategoryDb, "fetchSourceConfigurationBySourceType");

            let rssUrls = [
                { "url": "rssUrl1", "timestamp": "1234", "_id": "1" },
                { "url": "rssUrl2", "timestamp": "1234", "_id": "2" },
                { "url": "rssUrl3", "timestamp": "1234", "_id": "3" },
                { "url": "rssUrl4", "timestamp": "1234", "_id": "4" },
                { "url": "rssUrl5", "timestamp": "1234", "_id": "5" },
                { "url": "rssUrl6", "timestamp": "1234", "_id": "6" },
                { "url": "rssUrl7", "timestamp": "1234", "_id": "7" },
                { "url": "rssUrl8", "timestamp": "1234", "_id": "8" },
                { "url": "rssUrl9", "timestamp": "1234", "_id": "9" }
            ];
            let fbUrls = [
                { "url": "fbUrl1", "timestamp": "1234", "_id": "1" },
                { "url": "fbUrl2", "timestamp": "1234", "_id": "2" },
                { "url": "fbUrl3", "timestamp": "1234", "_id": "3" },
                { "url": "fbUrl4", "timestamp": "1234", "_id": "4" },
                { "url": "fbUrl5", "timestamp": "1234", "_id": "5" },
                { "url": "fbUrl6", "timestamp": "1234", "_id": "6" },
                { "url": "fbUrl7", "timestamp": "1234", "_id": "7" },
                { "url": "fbUrl8", "timestamp": "1234", "_id": "8" },
                { "url": "fbUrl9", "timestamp": "1234", "_id": "9" },
                { "url": "fbUrl10", "timestamp": "1234", "_id": "10" },
                { "url": "fbUrl11", "timestamp": "1234", "_id": "11" }
            ];

            categoryDbStub.withArgs("twitter").returns(Promise.resolve([]));
            categoryDbStub.withArgs("facebook").returns(Promise.resolve(fbUrls));
            categoryDbStub.withArgs("rss").returns(Promise.resolve(rssUrls));

            let refreshFeedsHandler = new RefreshFeedsHandler();
            refreshFeedsHandler.handleBatchRequests(dispatch, displayAllFeedsAsync, uiCallback);

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
                    { "url": "rssUrl1", "timestamp": "1234", "_id": "1" },
                    { "url": "rssUrl2", "timestamp": "1234", "_id": "2" },
                    { "url": "rssUrl3", "timestamp": "1234", "_id": "3" },
                    { "url": "rssUrl4", "timestamp": "1234", "_id": "4" },
                    { "url": "rssUrl5", "timestamp": "1234", "_id": "5" }
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
                uiCallback = () => {
                    done();
                };
                let rssUrls = [{ "url": "rssUrl1", "timestamp": "1234", "_id": "1" }];
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
                    { "url": "fbUrl1", "timestamp": "1234", "_id": "1" },
                    { "url": "fbUrl2", "timestamp": "1234", "_id": "2" }
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
                let token = EnvironmentConfig.instance().get("facebookAccessToken");
                let fbUrls = [
                    { "url": "fbUrl2", "timestamp": "1234", "_id": "2" }
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
