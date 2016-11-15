/* eslint max-nested-callbacks:0 */
"use strict";
import RssRequestHandler from "../../src/js/rss/RssRequestHandler.js";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import { expect } from "chai";
import sinon from "sinon";
import RssClient from "../../src/js/rss/RssClient";

describe("RssRequestHandler", () => {
    describe("fetchBatchRssFeeds", () => {
        it("should request rss fetch for a batch of sources", () => {
            let latestFeeds = [
                {
                    "title": "http://www.facebook.com/testuser",
                    "description": "fb description"
                }
            ];

            let postData = {
                "data": [
                    { "id": "rssid1", "url": "@Bangalore since:2016-01-02", "timestamp": 123456 },
                    { "id": "rssid2", "url": "@Bangalore since:2016-01-02", "timestamp": 123456 }
                ]
            };

            let requestHeader = { "Accept": "application/json", "Content-type": "application/json" };

            let sandbox = sinon.sandbox.create();
            let ajaxMock = new AjaxClient("/fetch-all-rss", true);
            let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxInstanceMock.withArgs("/fetch-all-rss").returns(ajaxMock);
            let ajaxPostMock = sandbox.mock(ajaxMock).expects("post");
            ajaxPostMock.withExactArgs(requestHeader, postData).returns(Promise.resolve(latestFeeds));
            return Promise.resolve(RssRequestHandler.fetchBatchRssFeeds(postData)).then((feeds) => {
                expect(feeds).to.eq(latestFeeds);
                ajaxInstanceMock.verify();
                ajaxPostMock.verify();
                sandbox.restore();
            });
        });
    });

    describe("fetchRSSFeeds", () => {
        it("should fetch rss feed for the given url", () => {
            let latestFeeds = [
                {
                    "title": "http://www.facebook.com/testuser",
                    "description": "fb description"
                }
            ];

            let sandbox = sinon.sandbox.create();
            let rssMock = new RssClient();
            let rssClientMock = sandbox.mock(RssClient).expects("instance").returns(rssMock);
            let rssPostMock = sandbox.mock(rssMock).expects("fetchRssFeeds").withExactArgs("www.example.com").returns(Promise.resolve(latestFeeds));
            return Promise.resolve(RssRequestHandler.fetchRssFeeds("www.example.com")).then((feeds) => {
                expect(feeds).to.eq(latestFeeds);
                rssClientMock.verify();
                rssPostMock.verify();
                sandbox.restore();
            });
        });
    });
});
