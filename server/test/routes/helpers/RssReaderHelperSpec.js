/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import RssReaderHelper from "../../../src/routes/helpers/RssReaderHelper";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";
import nock from "nock";

describe("RssReaderHelper", () => {
    function mockResponse(done, expectedValues) {
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

    it("should return feeds for the given url of a user", (done) => {
        let data = "<rss><item>" +
            "<title>sample</title></item></rss>";
        nock("http://www.thehindu.com/sport/cricket")

            .get("/?service=rss", {
            })
            .reply(HttpResponseHandler.codes.OK, data);
        let request = {
            "query": {
                "url": "http://www.thehindu.com/sport/cricket/?service=rss"
            }
        };
        let feedsJson = { "rss": { "item": [{ "title": ["sample"] }] } };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedsJson });
        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl();
    });

    it("should return 404 error if url is invalid", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .reply(HttpResponseHandler.codes.NOT_IMPLEMENTED, "");

        let request = {
            "query": {
                "url": "http://www.test1.com/cricket/"
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json": {} });
        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl();
    });

    it("should return error if request to url returns error", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .replyWithError("something awful happened");

        let request = {
            "query": {
                "url": "http://www.test1.com/cricket/"
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.NOT_FOUND, "json":
            { "message": new Error("something awful happened") } });
        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl();
    });

    it("should return empty response if url is empty", (done) => {
        let request = {
            "query": {
                "url": ""
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl();
    });

    it("should return empty response if url is not present", (done) => {
        let request = {
            "query": {
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.OK, "json": {} });
        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl();
    });

});
