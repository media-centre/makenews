/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import FetchFeedsFromAllSources from "../../src/fetchAllFeeds/FetchFeedsFromAllSources";
import RssRequestHandler from "../../src/rss/RssRequestHandler";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import CouchClient from "../../src/CouchClient.js";
import CryptUtil from "../../src/util/CryptUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import AdminDbClient from "../../src/db/AdminDbClient";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { assert, expect } from "chai";
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

    function mockFailureResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
                done();
            }
        };
        return response;
    }

    beforeEach("FetchFeedsFromAllSources", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("FetchFeedsFromAllSources", () => {
        sandbox.restore();
    });

    describe("FetchFeedsFromAllSources", () => {

        let accessToken = null;

        before("FetchFeedsFromAllSources", () => {
            accessToken = "test_token";
        });
        
        it("should send error response if there is an invalid data in the request body", (done) => {


            let requestBody = {
                "cookies": { "AuthSession": null }
            };
            let response = mockFailureResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });

            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestBody, response);
            fetchFeedsRequest.fetchFeeds().catch((errorResponse)=> {
                assert.deepEqual({ "error": "Invalid url data" }, errorResponse);
                done();
            });

        });

        it("should return the updated rss feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        {
                            "sourceType": "rss",
                            "_id": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms"
                        }
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

            fetchFeedsRequest.fetchFeedsFromSource({
                "_id": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                "sourceType": "rss"
            }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchRssFeedRequestMock.verify();

                done();
            });
        });

        it("should return the updated facebook feeds for valid request data", (done) => {

            let requestData = {
                "cookies": { "AuthSession": "test_token" }
            };
            let response = mockResponse();

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);

            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(accessToken).returns(facebookRequestHandlerInstance);

            let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("pagePosts");
            fetchFacebookFeedRequestMock.withExactArgs("www.facebook.com/theHindu", "posts").returns(Promise.resolve(response));


            let applicationConfigInstance = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfigInstance);
            sandbox.mock(applicationConfigInstance).expects("adminDetails").returns({
                "couchDbAdmin": {
                    "username": "test",
                    "password": "test"
                },
                "db": "test"
            });
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

            let couchdb = new CouchClient();
            sandbox.mock(CouchClient).expects("createInstance").returns(couchdb);
            sandbox.mock(couchdb).expects("getUserName").returns("test");
            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeedsFromSource({
                "_id": "www.facebook.com/theHindu",
                "sourceType": "fb_page"
            }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchFacebookFeedRequestMock.verify();
                done();
            });
        });

        it("should return the updated twitter feeds for valid request data", (done) => {

            let requestData = {
                "body": {
                    "data": [
                        { "sourceType": "twitter", "_id": "@TheHindu", "timestamp": "12344568" }
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
            fetchTwitterFeedRequestMock.withArgs(requestData.body.data[indexZero]._id).returns(Promise.resolve(response));
            let fetchFeedsRequest = new FetchFeedsFromAllSources(requestData, response);

            fetchFeedsRequest.fetchFeedsFromSource({ "_id": "@TheHindu", "sourceType": "twitter" }).then((feeds)=> {
                assert.deepEqual(response, feeds);
                fetchTwitterFeedRequestMock.verify();
                done();
            });
        });
    });

    it("should return success response after fetching documents and saving into the database", (done) => {
        let facebook = { "sourceType": "fb_page", "_id": "@TheHindu" };
        let requestData = {
            "cookies": { "AuthSession": "test_token" }
        };

        let response = mockResponse();

        let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(requestData, response);

        let applicationConfigInstance = new ApplicationConfig();
        sandbox.stub(ApplicationConfig, "instance").returns(applicationConfigInstance);
        sandbox.mock(applicationConfigInstance).expects("adminDetails").returns({
            "couchDbAdmin": {
                "username": "test",
                "password": "test"
            },
            "db": "test"
        });
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            }
        };
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
        let couchClientInstance = new CouchClient();
        sandbox.stub(CouchClient, "createInstance").withArgs("test_token").returns(couchClientInstance);
        sandbox.mock(couchClientInstance).expects("findDocuments").withArgs(selector).returns({ "docs": [facebook] });
        sandbox.mock(couchClientInstance).expects("getUserName").returns(Promise.resolve("test"));

        let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
        let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
        facebookRequestHandlerMock.withArgs("test_token").returns(facebookRequestHandlerInstance);
        let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("pagePosts");
        fetchFacebookFeedRequestMock.withArgs(facebook._id).returns(Promise.resolve(response));

        let saveDocumentMock = sandbox.mock(fetchFeedsFromAllSources).expects("saveFeedDocumentsToDb");
        saveDocumentMock.returns(Promise.resolve("Successfully added feeds to Database"));

        fetchFeedsFromAllSources.fetchFeedsFromAllSources().then((resp) => {
            assert.strictEqual(resp, "Successfully added feeds to Database");
            saveDocumentMock.verify();
            done();
        });
    });

    describe("saveFeedDocumentsToDb", () => {
        it("should throw failed to store in db when there is an error save bulk docs", async() => {
            let response = {
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

        it("should return success message when there is no error", async() => {
            let response = {
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
            let couchClientMock = new CouchClient(null, "accessToken");
            try {
                sinon.mock(CouchClient).expects("createInstance").returns(couchClientMock);
                sinon.stub(couchClientMock, "get").returns(Promise.resolve(response));
                sinon.stub(couchClientMock, "saveBulkDocuments").returns(Promise.resolve("Successfully added feeds to Database"));
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
        it("should get all url docs", () => {
            let response = {
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
                "couchDbAdmin": {
                    "username": "test",
                    "password": "test"
                },
                "db": "test"
            });

        });
        afterEach("GetFacebookAccessToken", () => {
            sandbox.restore();
        });

        it("should get the facebook acess token", async() => {
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

            let couchdb = new CouchClient();
            sandbox.mock(CouchClient).expects("createInstance").returns(couchdb);
            let couchClientMock = sandbox.mock(couchdb).expects("getUserName").returns(Promise.resolve("test"));
            let request = { "cookies": { "AuthSession": "test_token" }, "body": { "data": [] } };
            let response = {};
            let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(request, response);
            let token = await fetchFeedsFromAllSources._getFacebookAccessToken();
            assert.strictEqual(token, "test_token");
            appConfigMock.verify();
            couchClientMock.verify();
        });

        it("should throw error when couchclient throws an error", async() => {
            let couchClientMock = null;
            try {
                let couchdb = new CouchClient();
                sandbox.mock(CouchClient).expects("createInstance").returns(couchdb);
                couchClientMock = sandbox.mock(couchdb).expects("getUserName").returns(Promise.reject("unexpected response from the db"));
                let request = { "cookies": { "AuthSession": "test_token" }, "body": { "data": [] } };
                let response = {};
                let fetchFeedsFromAllSources = new FetchFeedsFromAllSources(request, response);
                await fetchFeedsFromAllSources._getFacebookAccessToken();
            } catch (error) {
                assert.strictEqual(error, "unexpected response from the db");
                couchClientMock.verify();
            }
        });
    });
});
