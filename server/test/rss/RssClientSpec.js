/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] max-len:0*/

"use strict";
import RssClient from "../../src/rss/RssClient"
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";
import { assert } from "chai";


describe("fetchRssFeeds", () => {
    it("should fetch rss feed for valid url", () => {
        let rssClientMock =new RssClient();
        let feed =[{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "source",
            "sourceType": "twitter",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        sinon.mock(rssClientMock).expects("getRssData").withArgs("www.example.com").returns(feed);
        return Promise.resolve(rssClientMock.fetchRssFeeds("www.example.com")).then(result => {
            assert.deepEqual(result, feed);
            rssClientMock.getRssData.restore();
        })

    });

    it.only("should call handleError when error message is other than FEEDS_NOT_FOUND ", () => {
        let rssClientMock =new RssClient();
        let error =[{
            "message": "new error"
        }];
        let getrssMock = sinon.mock(rssClientMock).expects("getRssData").withArgs("www.error.com");
        getrssMock.returns(Promise.reject({ "message": "Bad status code" }));
        let handleMock = sinon.mock(rssClientMock).expects("handleUrlError").withArgs("**");
        rssClientMock.fetchRssFeeds("www.error.com").catch(error => {
            handleMock.verify();
            rssClientMock.getRssData.restore();
            rssClientMock.handleUrlError.restore();
        })

    });

});