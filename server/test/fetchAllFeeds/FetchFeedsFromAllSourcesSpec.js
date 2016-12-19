/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import FetchFeedsFromAllSources from "../../src/fetchAllFeeds/FetchFeedsFromAllSources";
import RssRequestHandler from "../../src/rss/RssRequestHandler";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import LogTestHelper from "../helpers/LogTestHelper";
import CouchClient from "../../src/CouchClient.js";
import CryptUtil from "../../src/util/CryptUtil";



import { assert } from "chai";
import sinon from "sinon";

describe("FetchFeedsFromAllSources", () => {

    const indexZero = 0;
    let sandbox = null;

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

    beforeEach("FetchFeedsFromAllSources", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(FetchFeedsFromAllSources, "logger").returns(LogTestHelper.instance());
    });

    afterEach("FetchFeedsFromAllSources", () => {

        sandbox.restore();
    });

    describe("FetchFeedsFromAllSources", () => {

        let accessToken = null;

        before("FetchFeedsFromAllSources", () =>{
            accessToken = "test_token";
        });

        it("should validate the invalid request data and throw error", () => {

            let response = {};
            let fetchFeedsRequest = new FetchFeedsFromAllSources({ "cookies": {} }, response);
            assert.strictEqual(false, fetchFeedsRequest.isValidateRequestData());

        });

        it("should send error response if there is an invalid data in the request body", (done) => {

            let requestBody = {
                "data": [
                    { "source": "facebook" },
                    { "source": "twitter", "url": "http://www.twitter.com/testuser" },
                    { "source": "rss", "url": "http://www.test.com/testfeeds" }
                ],
                "facebookAccessToken": "test_token",
                "cookies": { "AuthSession": "test_token" }
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
                },
                "cookies": { "AuthSession": "test_token" }
            };
            let response = mockResponse();

            let rssRequestHandlerInstance = new RssRequestHandler();

            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);

            let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.withArgs("http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms").returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeedsFromSource({ "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms", "source": "rss" }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchRssFeedRequestMock.verify();

                done();
            });
        });

        it("should return the updated facebook feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "facebook", "url": "www.facebook.com/theHindu" }
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }
            };
            let response = mockResponse();

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);

            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(requestData.body.facebookAccessToken).returns(facebookRequestHandlerInstance);

            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("pagePosts");
            fetchFacebookFeedRequestMock.withArgs("www.facebook.com/theHindu").returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeedsFromSource({ "url": "www.facebook.com/theHindu", "source": "facebook" }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchFacebookFeedRequestMock.verify();
                done();
            });
        });

        it("should return the updated twitter feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "twitter", "url": "@TheHindu", "timestamp": "12344568" }
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }
            };
            let response = mockResponse();

            let twitterRequestHandlerInstance = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandlerInstance);
            let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandlerInstance).expects("fetchTweetsRequest");
            fetchTwitterFeedRequestMock.withArgs(requestData.body.data[indexZero].url).returns(Promise.resolve(response));
            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeedsFromSource({ "url": "@TheHindu", "source": "twitter" }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchTwitterFeedRequestMock.verify();
                done();
            });
        });

        xit("should return the updated twitter and facebook feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" },
                        { "source": "twitter", "url": "@TheHindu" },
                        { "source": "facebook", "url": "http://www.facebook.com/thehindu" }
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }

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
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);
            let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.withArgs(requestData.body.data[indexZero].url).returns(Promise.resolve(response));

            let twitterRequestHandlerInstance = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandlerInstance);
            let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandlerInstance).expects("fetchTweetsRequest");
            fetchTwitterFeedRequestMock.withArgs(requestData.body.data[indexZero].url).returns(Promise.resolve(response));

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(requestData.body.facebookAccessToken).returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("pagePosts");
            fetchFacebookFeedRequestMock.withArgs(requestData.body.data[indexZero].url).returns(Promise.resolve(response));

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);



            fetchFeedsRequest.fetchFeedsFromAllSources().then((response)=> {

                assert.deepEqual(finalResponse, feeds);
                fetchRssFeedRequestMock.verify();
                fetchTwitterFeedRequestMock.verify();
                fetchFacebookFeedRequestMock.verify();

                done();
            });
        });
    });

    it("should return success response after fetching documents and saving into the database", (done) => {
        let rss = { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
        let facebook = { "source": "twitter", "url": "@TheHindu" };
        let twitter = { "source": "facebook", "url": "http://www.facebook.com/thehindu" }
        let requestData = {
            "body": {
                "data": [
                    rss,
                    facebook,
                    twitter
                ],
                "facebookAccessToken": "test_token"
            },
            "cookies": { "AuthSession": "test_token" }

        };

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

        let response = mockResponse();

        let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
        //let sourceMock = sandbox.mock(fetchFeedsFromAllSources).expects("fetchFeedsFromSource");
        //sourceMock.returns(Promise.resolve(response));

        let rssRequestHandlerInstance = new RssRequestHandler();
        let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
        rssRequestHandlerMock.returns(rssRequestHandlerInstance);
        let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
        fetchRssFeedRequestMock.withArgs(requestData.body.data[indexZero].url).returns(Promise.resolve(response));

        let twitterRequestHandlerInstance = new TwitterRequestHandler();
        let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
        twitterRequestHandlerMock.returns(twitterRequestHandlerInstance);
        let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandlerInstance).expects("fetchTweetsRequest");
        fetchTwitterFeedRequestMock.withArgs("@TheHindu").returns(Promise.resolve(response));

        let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
        let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
        facebookRequestHandlerMock.withArgs(requestData.body.facebookAccessToken).returns(facebookRequestHandlerInstance);
        let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("pagePosts");
        fetchFacebookFeedRequestMock.withArgs("http://www.facebook.com/thehindu").returns(Promise.resolve(response));

        let saveDocumentMock = sandbox.mock(fetchFeedsFromAllSources).expects("saveFeedDocumentsToDb");
        saveDocumentMock.returns(Promise.resolve("Successfully added feeds to Database"));

        fetchFeedsFromAllSources.fetchFeedsFromAllSources().then((resp) => {
            console.log("**************")
            console.log(resp)
            assert.strictEqual(resp, "Successfully added feeds to Database");
            //sourceMock.verify();
            //saveDocumentMock.verify();
            done();
        }).catch(error => {
            console.log(error);
        });
    });

    describe("saveFeedDocumentsToDb", () => {
        it("should throw failed to store in db when there is an error save bulk docs", async() => {
            let response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "source": "twitter", "url": "@TheHindu" };
            let twitter = { "source": "facebook", "url": "http://www.facebook.com/thehindu" }
            let requestData = {
                "body": {
                    "data": [
                        rss,
                        facebook,
                        twitter
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }

            };
            let dbName = "dbName";
            let feeds = { "items": ["feed items"] };
            let couchClientMock = new CouchClient(null, "accessToken");
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
            try {
                sinon.mock(CouchClient).expects("createInstance").returns(couchClientMock);
                sinon.mock(couchClientMock).expects("get").returns(Promise.resolve(response));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                sinon.mock(couchClientMock).expects("saveBulkDocuments").returns(Promise.reject("failed to store in db"));
                await fetchFeedsFromAllSources.saveFeedDocumentsToDb(feeds);
            } catch (error) {
                assert.equal(error, "failed to store in db");
            } finally {
                CouchClient.createInstance.restore();
                couchClientMock.get.restore();
                CryptUtil.dbNameHash.restore();
                couchClientMock.saveBulkDocuments.restore();
            }
        });

        it("should return success message when there is no error", async () => {
            let response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "source": "twitter", "url": "@TheHindu" };
            let twitter = { "source": "facebook", "url": "http://www.facebook.com/thehindu" }
            let requestData = {
                "body": {
                    "data": [
                        rss,
                        facebook,
                        twitter
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }

            };
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
            let dbName = "dbName";
            let feeds = { "items": ["feed items"] };
            let couchClientMock = new CouchClient(null, "accessToken");
            try {
                sinon.mock(CouchClient).expects("createInstance").returns(couchClientMock);
                sinon.stub(couchClientMock, "get").returns(Promise.resolve(response));
                sinon.stub(couchClientMock, "saveBulkDocuments").returns(Promise.resolve("successfully stored in db"));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                let res = await fetchFeedsFromAllSources.saveFeedDocumentsToDb(feeds);
                assert.equal(res, "Successfully added feeds to Database");
            } catch (error) {
                assert.fail();
            } finally {
                CouchClient.createInstance.restore();
                couchClientMock.get.restore();
                CryptUtil.dbNameHash.restore();
                couchClientMock.saveBulkDocuments.restore();
            }
        });

    });

    describe("GetUrlDocs", () => {
        it.only("should get all url docs", () => {
            let response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "source": "rss", "url": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "source": "twitter", "url": "@TheHindu" };
            let twitter = { "source": "facebook", "url": "http://www.facebook.com/thehindu" }
            let requestData = {
                "body": {
                    "data": [
                        rss,
                        facebook,
                        twitter
                    ],
                    "facebookAccessToken": "test_token"
                },
                "cookies": { "AuthSession": "test_token" }

            };
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
            fetchFeedsFromAllSources._getUrlDocuments().then( response => {
                console.log(response);
            })

        });
    });
});
