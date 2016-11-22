/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/

"use strict";
import RssRequestHandler from "../../src/rss/RssRequestHandler";
import {assert, expect} from "chai";
import RssClient from "../../src/rss/RssClient";
import sinon from "sinon";

describe("RssRequestHandler", () => {
    describe("fetchRssFeedRequest", ()=> {
        let rssRequestHandler, feedsJson, rssMock, rssClientMock, sandbox;
        beforeEach("fetchRssFeedsRequest", () => {
            rssRequestHandler = new RssRequestHandler();
            sandbox = sinon.sandbox.create();
            feedsJson = {
                "items": [{
                    "guid": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                    "title": "NASA Administrator Remembers Apollo-Era Astronaut Edgar Mitchell",
                    "link": "http://www.nasa.gov/press-release/nasa-administrator-remembers-apollo-era-astronaut-edgar-mitchell",
                    "description": "The following is a statement from NASA Administrator Charles Bolden on the passing of NASA astronaut Edgar Mitchell:",
                    "pubDate": null,
                    "enclosures": [],
                    "image": {}
                }]
            };
            rssMock = new RssClient();
            rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssMock);
        });

        it("should fetch rss feed for given url", () => {
            let url = "www.example.com";
            let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url)
            rssClientPostMock.returns(feedsJson);
            return Promise.resolve(rssRequestHandler.fetchRssFeedRequest(url)).then((feeds) => {
                expect(feeds).to.eq(feedsJson);
                rssClientMock.verify();
                rssClientPostMock.verify();
                sandbox.restore();
            });
        });

        it("should return error rss feed for given url", () => {
            let url = "www.error.com";
            let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs(url)
            rssClientPostMock.returns(Promise.reject("error"));
            return rssRequestHandler.fetchRssFeedRequest(url).catch((error) => {
                assert.strictEqual("error", error);
                rssClientMock.verify();
                rssClientPostMock.verify();
                sandbox.restore();
            });
        });
    });
});
