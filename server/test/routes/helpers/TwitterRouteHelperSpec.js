"use strict";
import { assert } from "chai";
import nock from "nock";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import TwitterRouteHelper from "../../../src/routes/helpers/TwitterRouteHelper";
import TwitterClient, { searchApi, searchParams } from "../../../src/twitter/TwitterClient";
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
            "bearerToken": "Bearer AAAAAAAAAAAAAAAAAAAAAD%2BCjAAAAAAA6o%2F%2B5TG9BK7jC7dzrp%2F2%2Bs5lWFE%3DZATD8UM6YQoou2tGt68hoFR4VuJ4k791pcLtmIvTyfoVbMtoD8",
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

    it("should return empty response if the url is empty", (done) => {
        let request = {
            "query": {
                "url": ""
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });

        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterRouter();
    });

    it("should return empty response if url is not present", (done) => {
        let request = {
            "query": {
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
                "url": "@the_hindu"
            }
        };
        mockTwitterRequest()
            .query({ "q": "@the_hindu", "count": FEEDS_COUNT + searchParams })
            .reply(HttpResponseHandler.codes.OK, expectedData, expectedData);

        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": expectedData });

        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterRouter();

    });

    it("should return 404 error if url is invalid", (done) => {
        let url = "myTest";
        mockTwitterRequest()
            .query({ "q": url, "count": FEEDS_COUNT + searchParams })
            .reply(HttpResponseHandler.codes.NOT_IMPLEMENTED, "");

        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": url + " is not a valid twitter handler" } });
        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterRouter();
    });

    it("should return 404 error if url is not valid twitter url", (done) => {
        let url = "myTest";
        mockTwitterRequest()
            .query({ "q": url, "count": FEEDS_COUNT + searchParams })
            .reply(HttpResponseHandler.codes.OK, { "statuses": [], "search_metadata": { "completed_in": 0.01 } });

        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": url + " is not a valid twitter handler" } });
        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterRouter();
    });

    it("should return error if request to url returns error", (done) => {
        let url = "myTest1";
        mockTwitterRequest()
            .query({ "q": url, "count": FEEDS_COUNT + searchParams })
            .replyWithError("request failed");

        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json":
        { "message": "Request failed for twitter handler " + url } });
        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterRouter();
    });

    it("should return all feeds from all the tweet hashtags", (done)=> {
        var Jan18Timestamp = "2016-01-18T06:12:19+00:00";
        var Jan17Timestamp = "2016-01-17T06:12:19+00:00";

        let hinduResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp },
            { "id": 2, "id_str": "124", "text": "Tweet 2", "created_at": Jan17Timestamp }] };

        let toiResponseWithTimestamp = { "statuses": [{ "id": 1, "id_str": "123", "text": "Tweet 1", "created_at": Jan18Timestamp }] };

        let request = {
            "body": {
                "data": [
                    { "url": "@the_hindu", "timestamp": Jan17Timestamp, "id": "tweet1_id" },
                    { "url": "@toi", "timestamp": Jan18Timestamp, "id": "tweet2_id" }
                ]
            }
        };
        mockTwitterRequest()
            .query({ "q": "@the_hindu&since:2016-01-17", "count": FEEDS_COUNT + searchParams })
            .reply(HttpResponseHandler.codes.OK, hinduResponseWithTimestamp, hinduResponseWithTimestamp);

        mockTwitterRequest()
            .query({ "q": "@toi&since:2016-01-18", "count": FEEDS_COUNT + searchParams })
            .reply(HttpResponseHandler.codes.OK, toiResponseWithTimestamp, toiResponseWithTimestamp);

        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": { "tweet1_id": hinduResponseWithTimestamp, "tweet2_id": toiResponseWithTimestamp } });

        let twitterRouteHelper = new TwitterRouteHelper(request, response);
        twitterRouteHelper.twitterBatchFetch();
    });
});
