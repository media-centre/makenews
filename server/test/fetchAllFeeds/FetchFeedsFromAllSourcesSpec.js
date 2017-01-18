/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
import FetchFeedsFromAllSources from "./../../src/fetchAllFeeds/FetchFeedsFromAllSources";
import RssRequestHandler from "../../src/rss/RssRequestHandler";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import CouchClient from "../../src/CouchClient.js";
import CryptUtil from "../../src/util/CryptUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { mockResponse } from "./../helpers/MockResponse";
import { userDetails } from "./../../src/Factory";
import { assert } from "chai";
import sinon from "sinon";

describe("FetchFeedsFromAllSources", () => {
    let sandbox = null, requestBody = null, response = null, fetchFeedsRequest = null;

    beforeEach("FetchFeedsFromAllSources", () => {
        sandbox = sinon.sandbox.create();
        requestBody = {
            "cookies": { "AuthSession": "test_token" }
        };
        response = mockResponse();
        fetchFeedsRequest = new FetchFeedsFromAllSources(requestBody, response);
    });

    afterEach("FetchFeedsFromAllSources", () => {
        sandbox.restore();
    });

    describe("FetchFeeds", () => {

        afterEach("FetchFeedsFromAllSources", () => {
            sandbox.restore();
        });

        it("should send error response if there is an invalid data in the request body", async () => {
            requestBody = {
                "cookies": { "AuthSession": null }
            };

            fetchFeedsRequest = new FetchFeedsFromAllSources(requestBody, response);
            let fetchFeedsFromAllSourcesMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromAllSources");
            fetchFeedsFromAllSourcesMock.returns(Promise.reject("error"));

            await fetchFeedsRequest.fetchFeeds();

            assert.deepEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            assert.deepEqual(response.json(), { "message": "bad request" });
        });

        it("should return success response if authSession is not empty ", async () => {
            let fetchFeedsFromAllSourcesMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromAllSources");
            fetchFeedsFromAllSourcesMock.returns(Promise.resolve("success"));

            await fetchFeedsRequest.fetchFeeds();

            assert.deepEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), "success");
        });
    });

    describe("fetchFeedsFromAllSources", () => {
        it("should call save the documents to db", async() => {
            let urlDocuments = [{ "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
            let getUrlDocumentsMock = sandbox.mock(fetchFeedsRequest).expects("_getUrlDocuments");
            getUrlDocumentsMock.returns(Promise.resolve(urlDocuments));
            let fetchAndUpdateTimeStampMock = sandbox.mock(fetchFeedsRequest).expects("fetchAndUpdateTimeStamp");
            fetchAndUpdateTimeStampMock.returns(Promise.resolve([]));
            let saveDocumentMock = sandbox.mock(fetchFeedsRequest).expects("saveFeedDocumentsToDb");
            saveDocumentMock.returns(Promise.resolve("Successfully added feeds to Database"));

            await fetchFeedsRequest.fetchFeedsFromAllSources();

            getUrlDocumentsMock.verify();
            fetchAndUpdateTimeStampMock.verify();
            saveDocumentMock.verify();
        });
    });

    describe("fetchAndUpdateTimeStamp", () => {
        let urlDocuments = null, couchClient = null;
        beforeEach("fetchAndUpdateTimeStamp", () => {
            urlDocuments = [{ "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
            let fetchFeedsFromSourceMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromSource");
            fetchFeedsFromSourceMock.returns(Promise.resolve(urlDocuments));
            couchClient = new CouchClient();
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
        });
        it("should return feeds if timestamp updated successfully ", async () => {
            let saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocumentMock.returns(Promise.resolve("success"));

            let feeds = await fetchFeedsRequest.fetchAndUpdateTimeStamp(urlDocuments[0]); //eslint-disable-line no-magic-numbers

            assert.deepEqual(feeds, urlDocuments);
            saveDocumentMock.verify();
        });

        it("should return emptyArry if timestamp is not updated ", async () => {
            let saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocumentMock.returns(Promise.reject("success"));

            let feeds = await fetchFeedsRequest.fetchAndUpdateTimeStamp(urlDocuments[0]); //eslint-disable-line no-magic-numbers

            assert.deepEqual(feeds, []);
            saveDocumentMock.verify();
        });

    });

    describe("fetchFeedsFromSource", () => {
        let urlDocument = null, feed = null;

        it("should return feeds for valid web url", async() => {
            urlDocument = { "docType": "source", "sourceType": "web", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            feed = [{ "docType": "feed", "sourceType": "web", "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);
            let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.returns(Promise.resolve(feed));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, feed);
        });

        it("should return empty for when the feed fetch request fails fro web url", async() => {
            urlDocument = { "docType": "source", "sourceType": "web", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let rssRequestHandlerInstance = new RssRequestHandler();
            let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
            rssRequestHandlerMock.returns(rssRequestHandlerInstance);
            let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
            fetchRssFeedRequestMock.returns(Promise.reject("error"));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, []);
        });

        it("should return feeds for valid facebook page url", async() => {
            urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "source" };
            feed = [{ "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "feed" }];

            let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
            getFacebookTokenMock.returns("facebook_token");
            let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds").withArgs(urlDocument._id, "posts");
            fetchFacebookFeedRequestMock.returns(Promise.resolve(feed));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, feed);
        });

        it("should return empty array for invalid facebook page url", async() => {
            urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "source" };
            let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
            getFacebookTokenMock.returns("facebook_token");
            let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds").withArgs(urlDocument._id, "posts");
            fetchFacebookFeedRequestMock.returns(Promise.reject("error"));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, []);
        });

        it("should return feeds for valid facebook group url", async() => {
            urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_group", "docType": "source" };
            feed = [{ "_id": "www.facebook.com/theHindu", "sourceType": "fb_group", "docType": "feed" }];

            let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
            getFacebookTokenMock.returns("facebook_token");
            let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds").withArgs(urlDocument._id, "feed");
            fetchFacebookFeedRequestMock.returns(Promise.resolve(feed));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, feed);
        });

        it("should return empty array for invalid facebook group url", async() => {
            urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_group", "docType": "source" };
            let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
            getFacebookTokenMock.returns("facebook_token");
            let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds").withArgs(urlDocument._id, "feed");
            fetchFacebookFeedRequestMock.returns(Promise.reject("error"));

            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

            assert.deepEqual(result, []);
        });

        it("should return feeds for valid twitter url", async() => {
            urlDocument = { "sourceType": "twitter", "_id": "@TheHindu", "timestamp": "12344568" };
            feed = [{ "sourceType": "twitter", "_id": "@TheHindu", "latestFeedTimeStamp": "12344568", "docType": "feed" }];
            let twitterRequestHandler = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandler);
            let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest").withArgs(urlDocument._id, urlDocument.latestFeedTimeStamp);
            fetchTwitterFeedRequestMock.returns(Promise.resolve(feed));
            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);
            assert.deepEqual(result, feed);
        });

        it("should return empty array for invalid twitter url", async() => {
            urlDocument = { "sourceType": "twitter", "_id": "@TheHindu", "timestamp": "12344568" };
            let twitterRequestHandler = new TwitterRequestHandler();
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
            twitterRequestHandlerMock.returns(twitterRequestHandler);
            let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest").withArgs(urlDocument._id, urlDocument.latestFeedTimeStamp);
            fetchTwitterFeedRequestMock.returns(Promise.reject("error"));
            let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);
            assert.deepEqual(result, []);
        });
    });

    describe("saveFeedDocumentsToDb", () => {
        it("should throw failed to store in db when there is an error save bulk docs", async() => {
            response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "sourceType": "twitter", "_id": "@TheHindu" };
            let twitter = { "sourceType": "facebook", "_id": "http://www.facebook.com/thehindu" };
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
            let couchClientMock = new CouchClient("accessToken");
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
            try {
                sinon.mock(CouchClient).expects("instance").returns(couchClientMock);
                sinon.mock(couchClientMock).expects("get").returns(Promise.resolve(response));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                sinon.mock(couchClientMock).expects("saveBulkDocuments").returns(Promise.reject("failed to store in db"));
                await fetchFeedsFromAllSources.saveFeedDocumentsToDb(feeds);
            } catch (error) {
                assert.equal(error, "failed to store in db");
            } finally {
                CouchClient.instance.restore();
                couchClientMock.get.restore();
                CryptUtil.dbNameHash.restore();
                couchClientMock.saveBulkDocuments.restore();
            }
        });

        it("should return success message when there is no error", async() => {
            response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "sourceType": "twitter", "_id": "@TheHindu" };
            let twitter = { "sourceType": "facebook", "_id": "http://www.facebook.com/thehindu" };
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
            let couchClientMock = new CouchClient("accessToken");
            try {
                sinon.mock(CouchClient).expects("instance").returns(couchClientMock);
                sinon.stub(couchClientMock, "get").returns(Promise.resolve(response));
                sinon.stub(couchClientMock, "saveBulkDocuments").returns(Promise.resolve("Successfully added feeds to Database"));
                sinon.mock(CryptUtil).expects("dbNameHash").withArgs(response.userCtx.name).returns(dbName);
                let res = await fetchFeedsFromAllSources.saveFeedDocumentsToDb(feeds);
                assert.equal(res, "Successfully added feeds to Database");
            } catch (error) {
                assert.fail();
            } finally {
                CouchClient.instance.restore();
                couchClientMock.get.restore();
                CryptUtil.dbNameHash.restore();
                couchClientMock.saveBulkDocuments.restore();
            }
        });

    });

    describe("GetUrlDocs", () => {
        it("should get all url docs", () => {
            response = {
                "userCtx": {
                    "name": "dbName"
                }
            };
            let rss = { "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "sourceType": "twitter", "_id": "@TheHindu" };
            let twitter = { "sourceType": "facebook", "_id": "http://www.facebook.com/thehindu" };
            let requestData = {
                "cookies": { "AuthSession": "test_token" }

            };
            let selector = {
                "selector": {
                    "docType": {
                        "$eq": "source"
                    }
                }
            };
            let couchClientInstance = new CouchClient();
            sandbox.stub(CouchClient, "createInstance").withArgs("test_token").returns(couchClientInstance);
            sandbox.mock(couchClientInstance).expects("findDocuments").withArgs(selector).returns({ "docs": [rss, facebook, twitter] });

            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);
            fetchFeedsFromAllSources._getUrlDocuments().then((resp) => {
                let ZERO = 0;
                assert.strictEqual(resp[ZERO]._id, rss._id);
            });
        });
    });

    describe("GetFacebookAccessToken", () => {
        let appConfigMock = null;
        beforeEach("GetFacebookAcessToken", () => {
            sandbox = sinon.sandbox.create();
            let applicationConfigInstance = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfigInstance);
            appConfigMock = sandbox.mock(applicationConfigInstance).expects("adminDetails").returns({
                "username": "test",
                "password": "test",
                "db": "test"
            });

        });
        afterEach("GetFacebookAccessToken", () => {
            sandbox.restore();
        });

        it("should get the facebook access token", async() => {
            let adminDbClient = new AdminDbClient();
            sandbox.mock(AdminDbClient).expects("instance").returns(adminDbClient);
            let findDocumentsMock = sandbox.mock(adminDbClient).expects("findDocuments");
            findDocumentsMock.returns(Promise.resolve({ "docs": [
                {
                    "_id": "test_facebookToken",
                    "access_token": "test_token",
                    "token_type": "bearer",
                    "expires_in": 1234,
                    "expired_after": 1234
                }] }));

            let userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs("test_token").returns({ "userName": "test" });
            let request = { "cookies": { "AuthSession": "test_token" }, "body": { "data": [] } };
            response = {};
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(request, response);
            let token = await fetchFeedsFromAllSources._getFacebookAccessToken();
            assert.strictEqual(token, "test_token");
            appConfigMock.verify();
            userDetailsMock.verify();
        });
    });
});
