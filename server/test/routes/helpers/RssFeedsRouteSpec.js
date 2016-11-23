/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/


import RssFeedsRoute from "../../../src/routes/helpers/RssFeedsRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import LogTestHelper from "../../helpers/LogTestHelper";
import Logger from "../../../src/logging/Logger";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import ramda from "ramda";

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
                    for(let index = 0; index < items.length; index = ramda.inc(index)) {
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
    before("RssFeedsRoute", () => {
        sinon.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("RssFeedsRoute", () => {
        Logger.instance.restore();
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
            .reply(HttpResponseHandler.codes.OK, data, { "content-type": "text/html" });

        let url = "http://www.google.com/users";
        let request = {
            "query": {
                "url": url
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return feeds for the given url of a user", (done) => {
        let data = `<?xml version="1.0" encoding="utf-8" ?>
                    <rss version="2.0" xml:base="http://www.nasa.gov/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:media="http://search.yahoo.com/mrss/"> <channel>
                    <item>
                     <title>NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell</title>
                     <link>http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell</link>
                     <description>The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:</description>
                    </item>
                    </channel>
                    </rss>`;
        nock("http://www.thehindu.com/sport/cricket")
            .get("/?service=rss")
            .reply(HttpResponseHandler.codes.OK, data, {
                "content-type": "application/rss+xml"
            });
        let request = {
            "query": {
                "url": "http://www.thehindu.com/sport/cricket/?service=rss"
            }
        };
        let feedsJson = {
            "items":
            [{
                "guid": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                "title": "NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell",
                "link": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                "description": "The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:",
                "pubDate": null,
                "enclosures": [],
                "image": {}
            }]
        };
        let response = mockSuccessResponse(done, { "status": HttpResponseHandler.codes.OK, "json": feedsJson });
        let rssRouteHelper = new RssFeedsRoute(request, response, next);
        rssRouteHelper.handle();
    });

    it("should return 400 error if url is invalid", (done) => {
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
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
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
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json":
        { "message": "bad request" } });
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
