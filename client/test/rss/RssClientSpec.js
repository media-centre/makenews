/* eslint max-nested-callbacks: [2, 3] */
"use strict";

import RssClient from "../../src/js/rss/RssClient";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";
import { assert } from "chai";

describe("RssClient", () => {
    let sandbox = null, rssClient = null, ajaxClient = null, url = null;
    let rssData = { "data": "feeds" };

    beforeEach("RssClient", () => {
        rssClient = RssClient.instance();
        sandbox = sinon.sandbox.create();
        ajaxClient = new AjaxClient(url, true);
        sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
    });

    afterEach("RssClient", () => {
        sandbox.restore();
    });

    it("should fetch the rss feeds of a given url", () => {
        url = "/rss-feeds";
        let ajaxGetStub = sandbox.stub(ajaxClient, "get");
        ajaxGetStub.withArgs({ "url": url }).returns(Promise.resolve(rssData));

        return rssClient.fetchRssFeeds(url).then((response) => {
            assert.deepEqual(rssData, response);
        });
    });

    it("should fetch batch of RSS feeds", () => {
        let ajaxPostStub = sandbox.stub(ajaxClient, "post");
        let rssUrls = { "data": [{ "url": "rssUrl1", "timestamp": "2016-01-16T07:36:17+00:00", "id": "1" },
            { "url": "rssUrl2", "timestamp": "2016-01-18T07:36:17+00:00", "id": "2" }] };
        let headers = {
            "Accept": "application/json",
            "Content-type": "application/json"
        };
        ajaxPostStub.withArgs(headers, rssUrls).returns(Promise.resolve(rssData));
        return rssClient.fetchBatchRssFeeds(rssUrls).then((feeds) => {
            assert.deepEqual(rssData, feeds);
        });
    });
});
