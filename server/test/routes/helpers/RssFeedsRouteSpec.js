/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import RssFeedsRoute from "../../../src/routes/helpers/RssFeedsRoute.js";
import RssClient from "../../../src/rss/RssClient";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import LogTestHelper from "../../helpers/LogTestHelper";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";

describe("RssFeedsRoute", () => {
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

    function mockSuccessResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                let items = jsonData.items;
                if(items) {
                    let expectedItems = expectedValues.json.items;
                    expect(items.length).to.eq(expectedItems.length);
                    for(let index = 0; index < items.length; index += 1) {
                        expect(items[index].title).to.eq(expectedItems[index].title);
                        expect(items[index].description).to.eq(expectedItems[index].description);
                    }
                }
                done();
            }
        };
        return response;
    }

    let next = {};
    before("TwitterRouteHelper", () => {
        sinon.stub(RssClient, "logger").returns(LogTestHelper.instance());
    });

    after("TwitterRouteHelper", () => {
        RssClient.logger.restore();
    });

    it("should return invalid if the url doesn't return feeds", (done) => {
        let data = `<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
        <TITLE>302 Moved</TITLE></HEAD><BODY>
        <H1>302 Moved</H1>
        The document has moved
        <A HREF="http://www.google.co.in/?gfe_rd=cr&amp;ei=h91eVqj4N-my8wexop6oAg">here</A>.
        </BODY></HTML>`;
        nock("http://www.google.com")
            .get("/users")
            .reply(HttpResponseHandler.codes.OK, data);

        let url = "http://www.google.com/users";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, "json": { "message": url + " is not a proper feed" } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return feeds for the given url of a user", (done) => {
        let data = `<rss version="2.0"><channel>
        <title>hindu</title>
        <link>http://hindu.com</link>
        <description>from hindu</description>
            <item>
                <title>test</title>
                <description>news cricket</description>
            </item>
        </channel></rss>`;
        nock("http://www.thehindu.com/sport/cricket")
            .get("/?service=rss")
            .reply(HttpResponseHandler.codes.OK, data);
        let request = {
            "query": {
                "url": "http://www.thehindu.com/sport/cricket/?service=rss"
            }
        };
        let feedsJson = {
            "items": [{ "title": "test",
                "description": "news cricket" }]
        };
        let response = mockSuccessResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedsJson });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return 500 error if url is invalid", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .reply(HttpResponseHandler.codes.NOT_IMPLEMENTED, "");

        let url = "http://www.test1.com/cricket/";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, "json": { "message": "Request failed for " + url } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return error if request to url returns error", (done) => {
        nock("http://www.test1.com/cricket")
            .get("/", {
            })
            .replyWithError("something awful happened");

        let url = "http://www.test1.com/cricket/";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, "json":
        { "message": "Request failed for " + url } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return empty response if url is empty", (done) => {
        let request = {
            "query": {
                "url": ""
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return empty response if url is not present", (done) => {
        let request = {
            "query": {
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

});
