/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";

import FetchFeedsFromAllSources from "../../src/fetchAllFeeds/FetchFeedsFromAllSources.js";
import RssRequestHandler from "../../src/rss/RssRequestHandler.js";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler.js";
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler.js";


import { assert } from "chai";
import sinon from "sinon";

describe("FetchFeedsFromAllSources", () => {

    function mockResponse() {
        let response = [
            {
                "title": "test title 01",
                "type": "rss"
            },
            {
                "title": "test title 02",
                "type": "twitter"
            },
            {
                "title": "test title 03",
                "type": "facebook"
            }
        ];
        return response;
    }

    describe("FetchFeedsFromAllSources", () => {

        let accessToken = null;

        before("FetchFeedsFromAllSources", () =>{
            accessToken = "test_token";
        });

        it("should validate the invalid request data and throw error", () => {

            let response = {};
            let fetchFeedsRequest = new FetchFeedsFromAllSources({}, response);
            assert.strictEqual(false, fetchFeedsRequest.isValidateRequestData());

        });

        it("should send error response if there is an invalid data in the request body", (done) => {

            let requestBody = {
                "data": [
                    { "source": "facebook" },
                    { "source": "twitter", "url": "http://www.twitter.com/testuser" },
                    { "source": "rss", "url": "http://www.test.com/testfeeds" }
                ],
                "facebookAccessToken": "test_token"
            };

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestBody, {});
            fetchFeedsRequest.fetchFeeds().catch((errorResponse)=> {
                assert.deepEqual({ "error": "Invalid url data" }, errorResponse);
                done();
            });

        });

        it("should return the updated rss feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "rss", "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }
                    ],
                    "facebookAccessToken": "test_token"
                }
            };
            let response = mockResponse();


            let rssRequestHandlerInstance = new RssRequestHandler();

            let rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestStub = sinon.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeeds().then((feeds)=> {

                assert.isTrue(fetchRssFeedRequestStub.called);
                assert.deepEqual(response, feeds);

                RssRequestHandler.instance.restore();
                rssRequestHandlerInstance.fetchRssFeedRequest.restore();

                done();
            });
        });

        it("should return the updated facebook feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "facebook", "url": "http://www.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }
                    ],
                    "facebookAccessToken": "test_token"
                }
            };
            let response = mockResponse();

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);

            let facebookRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(requestData.body.facebookAccessToken).returns(facebookRequestHandlerInstance);

            let fetchFacebookFeedRequestStub = sinon.stub(facebookRequestHandlerInstance, "pagePosts");
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeeds().then((feeds)=> {

                assert.isTrue(fetchFacebookFeedRequestStub.called);
                assert.deepEqual(response, feeds);

                FacebookRequestHandler.instance.restore();
                facebookRequestHandlerInstance.pagePosts.restore();
                done();
            });
        });

        it("should return the updated twitter feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "twitter", "url": "http://www.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms", "timestamp": "12344568"  }
                    ],
                    "facebookAccessToken": "test_token"
                }
            };
            let response = mockResponse();

            let twitterRequestHandlerInstance = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sinon.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandlerInstance);
            let fetchTwitterFeedRequestStub = sinon.stub(twitterRequestHandlerInstance, "fetchTweetsRequest");
            fetchTwitterFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));
            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeeds().then((feeds)=> {

                assert.isTrue(fetchTwitterFeedRequestStub.called);
                assert.deepEqual(response, feeds);

                TwitterRequestHandler.instance.restore();
                twitterRequestHandlerInstance.fetchTweetsRequest.restore();

                done();
            });
        });

        it("should return the updated twitter and facebook feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" },
                        { "source": "twitter", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" },
                        { "source": "facebook", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }
                    ],
                    "facebookAccessToken": "test_token"
                }
            };
            let response = mockResponse();

            let finalResponse = [{
                "title": "test title 01",
                "type": "rss"
            }, {
                "title": "test title 02",
                "type": "twitter"
            }, {
                "title": "test title 03",
                "type": "facebook"
            }, {
                "title": "test title 01",
                "type": "rss"
            }, {
                "title": "test title 02",
                "type": "twitter"
            }, {
                "title": "test title 03",
                "type": "facebook"
            }, {
                "title": "test title 01",
                "type": "rss"
            }, {
                "title": "test title 02",
                "type": "twitter"
            }, {
                "title": "test title 03",
                "type": "facebook"
            }];

            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sinon.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);
            let fetchRssFeedRequestStub = sinon.stub(rssRequestHandlerInstance, "fetchRssFeedRequest");
            fetchRssFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));

            let twitterRequestHandlerInstance = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sinon.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandlerInstance);
            let fetchTwitterFeedRequestStub = sinon.stub(twitterRequestHandlerInstance, "fetchTweetsRequest");
            fetchTwitterFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(requestData.body.facebookAccessToken).returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestStub = sinon.stub(facebookRequestHandlerInstance, "pagePosts");
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeeds().then((feeds)=> {

                assert.isTrue(fetchRssFeedRequestStub.called);
                assert.isTrue(fetchTwitterFeedRequestStub.called);
                assert.isTrue(fetchFacebookFeedRequestStub.called);
                assert.deepEqual(finalResponse, feeds);

                RssRequestHandler.instance.restore();
                rssRequestHandlerInstance.fetchRssFeedRequest.restore();

                TwitterRequestHandler.instance.restore();
                twitterRequestHandlerInstance.fetchTweetsRequest.restore();

                FacebookRequestHandler.instance.restore();
                facebookRequestHandlerInstance.pagePosts.restore();
                done();
            });
        });
    });
});
