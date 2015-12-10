"use strict";
import { assert } from "chai";
import nock from "nock";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import TwitterReaderHelper, { baseURL, searchApi } from "../../../src/routes/helpers/TwitterReaderHelper";



describe("TwitterReaderHelper", () => {
    function mockTwitterRequest() {
        return nock(baseURL)
            .get(searchApi);
    }

    function mockResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                assert.strictEqual(status, expectedValues.status);
            },
            "json": (jsonData) => {
                assert.deepEqual(jsonData, expectedValues.json);
                done();
            }
        };
        return response;
    }

    it("should return empty response if the url is empty", (done) => {
        let request = {
            "query": {
                "url": ""
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });

        let twitterReader = new TwitterReaderHelper(request, response);
        twitterReader.feedsForUrl();
    });

    it("should return empty response if url is not present", (done) => {
        let request = {
            "query": {
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
        let twitterReader = new TwitterReaderHelper(request, response);
        twitterReader.feedsForUrl();
    });

    it("should return data if the url is valid", (done) => {
        let expectedData = { "items": [{ "id": 1, "text": "Tweet 2" }, { "id": 2, "text": "Tweet 3" }] };
        let request = {
            "query": {
                "url": "@the_hindu"
            }
        };
        mockTwitterRequest()
            .query({ "q": "@the_hindu" })
            .reply(HttpResponseHandler.codes.OK, expectedData, expectedData);

        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": expectedData });

        let twitterReader = new TwitterReaderHelper(request, response);
        twitterReader.feedsForUrl();

    });

    it("should return 404 error if url is invalid", (done) => {
        let url = "myTest";
        mockTwitterRequest()
            .query({ "q": url })
            .reply(HttpResponseHandler.codes.NOT_IMPLEMENTED, "");

        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": { "message": url + " is not a valid twitter handler" } });
        let twitterReader = new TwitterReaderHelper(request, response);
        twitterReader.feedsForUrl();
    });

    it("should return error if request to url returns error", (done) => {
        let url = "myTest1";
        mockTwitterRequest()
            .query({ "q": url })
            .replyWithError("request failed");

        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json":
        { "message": "Request failed for twitter handler " + url } });
        let twitterReader = new TwitterReaderHelper(request, response);
        twitterReader.feedsForUrl();
    });
});
