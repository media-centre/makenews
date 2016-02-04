"use strict";
import { assert } from "chai";
import nock from "nock";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import TwitterRouteHelper from "../../../src/routes/helpers/TwitterRouteHelper";
import TwitterClient, { searchApi, searchParams } from "../../../src/twitter/TwitterClient";
import TwitterLogin from "../../../src/twitter/TwitterLogin.js";
import TwitterRequestHandler from "../../../src/twitter/TwitterRequestHandler.js";
import ApplicationConfig from "../../../src/config/ApplicationConfig.js";
import LogTestHelper from "../../helpers/LogTestHelper";
import Logger from "../../../src/logging/Logger.js";
import sinon from "sinon";

describe("TwitterRouteHelper", () => {
    function mockTwitterRequest() {
        return nock("https://api.twitter.com/1.1", {
            "reqheaders": {
                "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAD%2BCjAAAAAAA6o%2F%2B5TG9BK7jC7dzrp%2F2%2Bs5lWFE%3DZATD8UM6YQoou2tGt68hoFR4VuJ4k791pcLtmIvTyfoVbMtoD8"
            }
        }).get(searchApi);
    }

    function mockResponse(done, expectedValues) {
        return {
            "status": (status) => {
                assert.strictEqual(status, expectedValues.status);
            },
            "json": (jsonData) => {
                assert.deepEqual(jsonData, expectedValues.json);
                done();
            }
        };
    }

    let applicationConfig = null;
    const FEEDS_COUNT = 100;

    before("TwitterRouteHelper", () => {
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(TwitterClient, "logger").returns(LogTestHelper.instance());
        sinon.stub(applicationConfig, "twitter").returns({
            "url": "https://api.twitter.com/1.1",
            "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
            "consumerKey": "consumerKey",
            "consumerSecret": "consimerSecret",
            "timeOut": 10000
        });
        sinon.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("TwitterRouteHelper", () => {
        ApplicationConfig.instance.restore();
        TwitterClient.logger.restore();
        applicationConfig.twitter.restore();
        Logger.instance.restore();
    });

    describe("twitterRouter", () => {
        let sandbox = null;
        beforeEach("twitterRouter", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("twitterRouter", () => {
            sandbox.restore();
        });
        it("should return empty response if the url is empty", (done) => {
            let request = {
                "query": {
                    "url": "",
                    "userName": "testUser"
                }
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });

            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            twitterRouteHelper.twitterRouter();
        });

        it("should return empty response if url is not present", (done) => {
            let request = {
                "query": {
                    "userName": "testUser"
                }
            };
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            twitterRouteHelper.twitterRouter();
        });

        it("should return data if the url is valid", (done) => {
            let expectedData = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1" }, { "id": 2, "id_str": "124", "text": "Tweet 2" }] };
            let request = {
                "query": {
                    "url": "@the_hindu",
                    "userName": "testUser"
                }
            };
            let twitterRequestHandler = new TwitterRequestHandler();
            sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
            let fetchTweetsRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest");
            fetchTweetsRequestMock.withArgs(request.query.url, request.query.userName).returns(Promise.resolve(expectedData));
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": expectedData });

            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.resolve(twitterRouteHelper.twitterRouter()).then((data) => {
                assert.strictEqual(data, expectedData);
                fetchTweetsRequestMock.verify();
            });
        });

        it("should return 404 error if url is invalid", (done) => {
            let request = {
                "query": {
                    "url": "@myTest",
                    "userName": "testUser"
                }
            };
            let twitterRequestHandler = new TwitterRequestHandler();
            sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
            let fetchTweetsRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest");
            fetchTweetsRequestMock.withArgs(request.query.url, request.query.userName).returns(Promise.reject({ message: 'myTest is not a valid twitter handler' }));
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": "myTest is not a valid twitter handler" } });

            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.reject(twitterRouteHelper.twitterRouter()).catch(() => {
                fetchTweetsRequestMock.verify();
            });
        });

        it("should return 404 error if url is not valid twitter url", (done) => {
            let request = {
                "query": {
                    "url": "myTest",
                    "userName": "testUser"
                }
            };
            let twitterRequestHandler = new TwitterRequestHandler();
            sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
            let fetchTweetsRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest");
            fetchTweetsRequestMock.withArgs(request.query.url, request.query.userName).returns(Promise.reject({ message: 'myTest is not a valid twitter handler' }));
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": "myTest is not a valid twitter handler" } });

            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.reject(twitterRouteHelper.twitterRouter()).catch(() => {
                fetchTweetsRequestMock.verify();
            });
        });

        it("should return error if request to url returns error", (done) => {
            let request = {
                "query": {
                    "url": "myTest1",
                    "userName": "testUser"
                }
            };
            let url = "myTest1";
            let twitterRequestHandler = new TwitterRequestHandler();
            sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
            let fetchTweetsRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest");
            fetchTweetsRequestMock.withArgs(request.query.url, request.query.userName).returns(Promise.reject({ "message": "Request failed for twitter handler " + url }));
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": "Request failed for twitter handler " + url } });

            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.reject(twitterRouteHelper.twitterRouter()).catch(() => {
                fetchTweetsRequestMock.verify();
            });
        });
    });

    describe("twitterBatchFetch", () => {
        it("should return all feeds from all the tweet hashtags", (done)=> {
            let Jan18Timestamp = "2016-01-18T06:12:19+00:00", sandbox = sinon.sandbox.create();
            let Jan17Timestamp = "2016-01-17T06:12:19+00:00";

            let hinduResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp },
                { "id": 2, "id_str": "124", "text": "Tweet 2", "created_at": Jan17Timestamp }] };

            let toiResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp }] };

            let request = {
                "body": {
                    "data": [
                        { "url": "@the_hindu", "timestamp": Jan17Timestamp, "id": "tweet1_id" },
                        { "url": "@toi", "timestamp": Jan18Timestamp, "id": "tweet2_id" }
                    ],
                    "userName": "testUser"
                }
            };

            let urlResponse = { "@the_hindu": Promise.resolve(hinduResponseWithTimestamp), "@toi": Promise.resolve(toiResponseWithTimestamp) };
            let twitterRequestHandler = {
                "fetchTweetsRequest": (url) => {
                    return urlResponse[url];
                }
            };
            sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
            let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": { "tweet1_id": hinduResponseWithTimestamp, "tweet2_id": toiResponseWithTimestamp } });
            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            twitterRouteHelper.twitterBatchFetch();
        });
    });

    describe("requestToken", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should redirect to authenticate with requestToken", () => {
            let twitterLogin = new TwitterLogin();
            let token = "token", expectedUrl = "https://api.twitter.com/oauth/authenticate?oauth_token=" + token;
            let clientCallbackUrl = "clientUrl", serverCallbackUrl = "serverUrl";
            twitterLogin.oauthToken = token;
            let twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": "Maharjun" }).returns(Promise.resolve(twitterLogin));
            let response = { "status": () => {}, "json": () => {} };
            let request = {
                "query": {
                    "clientCallbackUrl": clientCallbackUrl,
                    "serverCallbackUrl": serverCallbackUrl,
                    "userName": "Maharjun"
                }
            };
            let responseMock = sandbox.mock(response);
            responseMock.expects("status").withArgs(HttpResponseHandler.codes.OK);
            responseMock.expects("json").withArgs({ "authenticateUrl": expectedUrl });
            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.resolve(twitterRouteHelper.requestToken()).then(() => {
                twitterLoginMock.verify();
                responseMock.verify();
            });
        });
    });

    describe("twitterAuthenticateCallback", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should return the clientCallbackUrl on success", () => {
            let twitterLogin = new TwitterLogin();
            let oauthToken = "oauth_token", oauthVerifier = "oauth_verifier", clientRedirectUrl = "clientRedirectUrl";
            let twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "previouslyFetchedOauthToken": oauthToken }).returns(Promise.resolve(twitterLogin));
            let accessTokenFromTwitterMock = sandbox.mock(twitterLogin).expects("accessTokenFromTwitter").withArgs(oauthVerifier).returns(Promise.resolve(clientRedirectUrl));
            let response = { "redirect": () => {} };
            let request = {
                "query": {
                    "oauth_token": oauthToken,
                    "oauth_verifier": oauthVerifier
                }
            };
            let responseMock = sandbox.mock(response);
            responseMock.expects("redirect").withArgs(clientRedirectUrl);
            let twitterRouteHelper = new TwitterRouteHelper(request, response);
            return Promise.resolve(twitterRouteHelper.twitterAuthenticateCallback()).then(() => {
                twitterLoginMock.verify();
                accessTokenFromTwitterMock.verify();
                responseMock.verify();
            });
        });
    });
});
