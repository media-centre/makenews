/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import RssReaderHelper from "../../../src/routes/helpers/RssReaderHelper";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";
import nock from "nock";
import winston from "winston";

describe("RssReaderHelper", () => {
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
        let response = {
        };


        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl().then((feeds) => {
            expect(feeds.statusCode).to.eq(HttpResponseHandler.codes.OK);
            let feedsJson = { "rss": { "item": [{ "title": ["sample"] }] } };
            expect(feeds.json).to.deep.equal(feedsJson);
            done();
        });
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
        let response = {
        };


        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl().then((feeds) => {
            expect(feeds.statusCode).to.eq(HttpResponseHandler.codes.NOT_FOUND);
            done();
        });


    });

    it("should return empty response if url is empty", (done) => {

        let request = {
            "query": {
                "url": ""
            }
        };
        let response = {
        };

        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl().then((feeds) => {
            expect(feeds.statusCode).to.eq(HttpResponseHandler.codes.OK);
            expect(feeds.json).to.deep.eq({});
            done();
        });
    });
    it("should return empty response if url is not present", (done) => {

        let request = {
            "query": {
            }
        };
        let response = {
        };

        let rssReaderHelper = new RssReaderHelper(request, response);
        rssReaderHelper.feedsForUrl().then((feeds) => {
            expect(feeds.statusCode).to.eq(HttpResponseHandler.codes.OK);
            expect(feeds.json).to.deep.eq({});
            done();
        });
    });

});
