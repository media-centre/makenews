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
import DateUtil from "./../../src/util/DateUtil";

describe("FetchFeedsFromAllSources", () => {
    let sandbox = null, requestBody = null, response = null, fetchFeedsRequest = null;
    const accessToken = "test_token";

    beforeEach("FetchFeedsFromAllSources", () => {
        sandbox = sinon.sandbox.create();
        requestBody = {
            "cookies": { "AuthSession": accessToken }
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

        it("should send error response if there is an invalid data in the request body", async() => {
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

        it("should return success response after getting the feeds", async() => {
            let fetchFeedsFromAllSourcesMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromAllSources");
            fetchFeedsFromAllSourcesMock.returns(Promise.resolve([{ "_id": "1", "title": "title" }]));
            const saveDocMock = sandbox.mock(fetchFeedsRequest).expects("saveFeedDocumentsToDb").returns(Promise.resolve("success"));

            await fetchFeedsRequest.fetchFeeds();

            saveDocMock.verify();
            assert.deepEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), { "status": true });
        });

        it("should return false status if there are no new feeds", async() => {
            let fetchFeedsFromAllSourcesMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromAllSources");
            fetchFeedsFromAllSourcesMock.returns(Promise.resolve([]));

            await fetchFeedsRequest.fetchFeeds();

            assert.deepEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), { "status": false, "message": "No new feeds" });
        });
    });

    describe("fetchFeedsFromAllSources", () => {
        it("should fetch the feeds when since is not present in source url", async() => {
            let urlDocuments = [{ "sourceType": "web", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
            const expectedFeeds = { "docs": [{ "_id": 1, "title": "Something" }, { "_id": 2, "title": "Something1" }], "paging": {} };
            let fetchFeedsFromSourceMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromSource");
            fetchFeedsFromSourceMock.returns(Promise.resolve(expectedFeeds));
            let getUrlDocumentsMock = sandbox.mock(fetchFeedsRequest).expects("_getUrlDocuments");
            getUrlDocumentsMock.returns(Promise.resolve(urlDocuments));
            let updateTimeMock = sandbox.mock(fetchFeedsRequest).expects("updateUrlTimeStamp");
            updateTimeMock.returns(Promise.resolve([]));

            const feeds = await fetchFeedsRequest.fetchFeedsFromAllSources();

            assert.deepEqual(feeds, expectedFeeds.docs);

            getUrlDocumentsMock.verify();
            updateTimeMock.verify();
        });

        it("should get the feeds only when the latestTimeStamp interval is more", async() => {
            let urlDocuments = [
                { "sourceType": "web",
                    "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                    "since": 1487927102
                },
                { "sourceType": "web",
                    "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                    "since": 1487927202
                }
            ];

            const currentTime = 1487927602;
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(currentTime);

            const expectedFeeds = { "docs": [{ "_id": 1, "title": "Something" }, { "_id": 2, "title": "Something1" }],
                "paging": { "since": 1487927102 } };
            let fetchFeedsFromSourceMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromSource");
            fetchFeedsFromSourceMock.withArgs({ "sourceType": "web",
                "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                "since": 1487927102
            }).returns(Promise.resolve(expectedFeeds));
            let getUrlDocumentsMock = sandbox.mock(fetchFeedsRequest).expects("_getUrlDocuments");
            getUrlDocumentsMock.returns(Promise.resolve(urlDocuments));
            let updateTimeStamp = sandbox.mock(fetchFeedsRequest).expects("updateUrlTimeStamp");
            updateTimeStamp.returns(Promise.resolve([]));

            const feeds = await fetchFeedsRequest.fetchFeedsFromAllSources();

            fetchFeedsFromSourceMock.verify();

            assert.deepEqual(feeds, expectedFeeds.docs);
            getUrlDocumentsMock.verify();
            updateTimeStamp.verify();
        });

        it("should get empty array if all the urls feeds were fetched recently", async() => {
            let urlDocuments = [
                { "sourceType": "web",
                    "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                    "since": 1487927502
                },
                { "sourceType": "web",
                    "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms",
                    "since": 1487927602
                }
            ];

            const currentTime = 1487927902;
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(currentTime);

            let fetchFeedsFromSourceMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromSource");
            fetchFeedsFromSourceMock.never();
            let getUrlDocumentsMock = sandbox.mock(fetchFeedsRequest).expects("_getUrlDocuments");
            getUrlDocumentsMock.returns(Promise.resolve(urlDocuments));

            const feeds = await fetchFeedsRequest.fetchFeedsFromAllSources();

            fetchFeedsFromSourceMock.verify();
            getUrlDocumentsMock.verify();

            assert.deepEqual(feeds, []);
        });
    });

    describe("updateUrlTimeStamp", () => {
        let urlDocuments = null, couchClient = null;
        beforeEach("updateUrlTimeStamp", () => {
            urlDocuments = [{ "sourceType": "rss", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
            let fetchFeedsFromSourceMock = sandbox.mock(fetchFeedsRequest).expects("fetchFeedsFromSource");
            fetchFeedsFromSourceMock.returns(Promise.resolve(urlDocuments));
            couchClient = new CouchClient();
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
        });

        it("should call the saveDoc with the updated source", async() => {
            sandbox.stub(DateUtil, "getCurrentTime").returns("12955678");
            const urlDoc = { "_id": 1, "sourceType": "twitter", "title": "heading", "since": "12345678" };
            const paging = { "since": "13012345" };
            let saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocumentMock.withExactArgs(encodeURIComponent(urlDoc._id), { "_id": 1, "sourceType": "twitter", "title": "heading", "since": "13012345" });
            await fetchFeedsRequest.updateUrlTimeStamp(urlDoc, paging);

            saveDocumentMock.verify();
        });
    });

    describe("fetchFeedsFromSource", () => {
        let urlDocument = null, feeds = null;

        describe("web", () => {
            it("should return feeds for valid web url", async() => {
                urlDocument = { "docType": "source", "sourceType": "web", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
                feeds = [{ "docType": "feed", "sourceType": "web", "url": "http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" }];
                let rssRequestHandlerInstance = new RssRequestHandler();
                let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
                rssRequestHandlerMock.returns(rssRequestHandlerInstance);
                let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
                fetchRssFeedRequestMock.returns(Promise.resolve(feeds));

                let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                assert.deepEqual(result, feeds);
            });

            it("should return empty for when the feed fetch request fails from web url", async() => {
                urlDocument = { "docType": "source", "sourceType": "web", "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
                let rssRequestHandlerInstance = new RssRequestHandler();
                let rssRequestHandlerMock = sandbox.mock(RssRequestHandler).expects("instance");
                rssRequestHandlerMock.returns(rssRequestHandlerInstance);
                let fetchRssFeedRequestMock = sandbox.mock(rssRequestHandlerInstance).expects("fetchBatchRssFeedsRequest");
                fetchRssFeedRequestMock.returns(Promise.reject("error"));

                let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                assert.deepEqual(result, { "docs": [] });
            });

        });

        describe("facebook", () => {
            it("should return feeds for valid facebook page url", async() => {
                urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "source", "since": "123456789" };
                feeds = [{ "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "feed" }];

                let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
                getFacebookTokenMock.returns("facebook_token");
                let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
                let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
                facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
                let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds")
                    .withExactArgs(urlDocument._id, "posts", { "since": "123456789" }).returns(Promise.resolve(feeds));

                let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                fetchFacebookFeedRequestMock.verify();
                assert.deepEqual(result, feeds);
            });

            it("should return empty array for invalid facebook page url", async() => {
                urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_page", "docType": "source" };
                let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
                getFacebookTokenMock.returns("facebook_token");
                let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
                let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
                facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
                let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance)
                    .expects("fetchFeeds").withExactArgs(urlDocument._id, "posts", { "since": 0 });
                fetchFacebookFeedRequestMock.returns(Promise.reject("error"));

                let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                facebookRequestHandlerMock.verify();
                assert.deepEqual(result, { "docs": [] });
            });

            it("should return feeds for valid facebook group url", async() => {
                urlDocument = { "_id": "www.facebook.com/theHindu", "sourceType": "fb_group", "docType": "source" };
                feeds = [{ "_id": "www.facebook.com/theHindu", "sourceType": "fb_group", "docType": "feed" }];

                let getFacebookTokenMock = sandbox.mock(fetchFeedsRequest).expects("_getFacebookAccessToken");
                getFacebookTokenMock.returns("facebook_token");
                let facebookRequestHandlerInstance = new FacebookRequestHandler("test_token");
                let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
                facebookRequestHandlerMock.withArgs("facebook_token").returns(facebookRequestHandlerInstance);
                let fetchFacebookFeedRequestMock = sandbox.mock(facebookRequestHandlerInstance).expects("fetchFeeds").withArgs(urlDocument._id, "feed");
                fetchFacebookFeedRequestMock.returns(Promise.resolve(feeds));

                let result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                assert.deepEqual(result, feeds);
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

                assert.deepEqual(result, { "docs": [] });
            });
        });

        describe("twitter", () => {
            it("should return feeds for valid twitter url", async() => {
                urlDocument = { "sourceType": "twitter", "_id": "@TheHindu", "since": "12344568", "sinceId": "835103042471096320" };
                feeds = { "docs": [
                    { "sourceType": "twitter", "_id": "@TheHindu", "since": "12344568", "docType": "feed" }
                ],
                "paging": {
                    "sinceId": "123124123131",
                    "since": 124123432
                }
                };
                let twitterRequestHandler = new TwitterRequestHandler();
                let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
                twitterRequestHandlerMock.returns(twitterRequestHandler);
                let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest")
                    .withExactArgs(urlDocument._id, urlDocument.since, accessToken, urlDocument.sinceId);
                fetchTwitterFeedRequestMock.returns(Promise.resolve(feeds));

                const result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                fetchTwitterFeedRequestMock.verify();
                assert.deepEqual(result, feeds);
            });

            it("should return empty array for invalid twitter url", async() => {
                urlDocument = { "sourceType": "twitter", "_id": "@TheHindu", "since": "12344568", "sinceId": "835103042471096320" };
                let twitterRequestHandler = new TwitterRequestHandler();
                let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
                twitterRequestHandlerMock.returns(twitterRequestHandler);
                let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest")
                    .withExactArgs(urlDocument._id, urlDocument.since, accessToken, urlDocument.sinceId);
                fetchTwitterFeedRequestMock.returns(Promise.reject("error"));

                const result = await fetchFeedsRequest.fetchFeedsFromSource(urlDocument);

                fetchTwitterFeedRequestMock.verify();
                assert.deepEqual(result, { "docs": [] });
            });
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
        it("should get all url docs", async() => {
            let rss = { "sourceType": "rss",
                "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" };
            let facebook = { "sourceType": "twitter", "_id": "@TheHindu" };
            let twitter = { "sourceType": "facebook", "_id": "http://www.facebook.com/thehindu" };
            let selector = {
                "selector": {
                    "docType": {
                        "$eq": "source"
                    }
                },
                "skip": 0
            };
            let couchClientInstance = new CouchClient();
            let findDocsMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .withArgs(selector).returns({ "docs": [rss, facebook, twitter] });

            let resp = await fetchFeedsRequest._getUrlDocuments(couchClientInstance);
            findDocsMock.verify();
            const expectedFeeds = [rss, facebook, twitter];
            assert.deepEqual(resp, expectedFeeds);
        });

        it("should get the url docs recursively, if there are more than 25 url docs", async() => {
            const feedResults1 = [{ "sourceType": "rss",
                "_id": "http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms" },
            { "sourceType": "twitter", "_id": "@TheHindu" },
            { "sourceType": "facebook", "_id": "http://www.facebook.com/thehindu" }];
            const feedResults2 = [{ "sourceType": "twitter", "_id": "@TheEconomicsTimes" },
                { "sourceType": "facebook", "_id": "http://www.facebook.com/minion" }];
            const offset = 3;
            fetchFeedsRequest.DOCSLIMIT = offset;

            const query1 = {
                "selector": {
                    "docType": {
                        "$eq": "source"
                    }
                },
                "skip": 0
            };
            const query2 = {
                "selector": {
                    "docType": {
                        "$eq": "source"
                    }
                },
                "skip": offset
            };

            let couchClientInstance = new CouchClient();
            let findDocsStub = sandbox.stub(couchClientInstance, "findDocuments");
            findDocsStub.withArgs(query1).returns({ "docs": feedResults1 });
            findDocsStub.withArgs(query2).returns({ "docs": feedResults2 });

            const expectedFeeds = [...feedResults1, ...feedResults2];
            let resp = await fetchFeedsRequest._getUrlDocuments(couchClientInstance);
            assert.deepEqual(resp, expectedFeeds);
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
