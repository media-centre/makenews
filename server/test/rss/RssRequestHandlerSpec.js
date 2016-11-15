/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/

"use strict";
import RssRequestHandler from  "../../src/rss/RssRequestHandler";
import { assert } from "chai";
import RssClient from "../../src/rss/RssClient";
import sinon from "sinon";
import { expect } from "chai";


describe("fetchRssFeedRequest", ()=>{
    it("should fetch rss feed for given url", () => {
        let rssRequestHandler = new RssRequestHandler();
        let sandbox = sinon.sandbox.create();
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
        let rssMock = new RssClient();
        let rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssMock);
        let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs("www.example.com")
         rssClientPostMock.returns(feedsJson);
        return Promise.resolve(rssRequestHandler.fetchRssFeedRequest("www.example.com")).then((feeds) => {
            expect(feeds).to.eq(feedsJson);
            rssClientMock.verify();
            rssClientPostMock.verify();
            sandbox.restore();
        });
    });

    it("should return error rss feed for given url", () => {
        let rssRequestHandler = new RssRequestHandler();
        let sandbox = sinon.sandbox.create();
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
        let rssMock = new RssClient();
        let rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssMock);
        let rssClientPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withArgs("www.error.com")
         rssClientPostMock.returns(Promise.reject("error"));
        return rssRequestHandler.fetchRssFeedRequest("www.error.com").catch((error) => {
            assert.strictEqual("error", error);
            rssClientMock.verify();
            rssClientPostMock.verify();
            sandbox.restore();
        });
    });
});
