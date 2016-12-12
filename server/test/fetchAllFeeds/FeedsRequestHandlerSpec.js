import FeedsRequestHandler from "../../src/fetchAllFeeds/FeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FeedsRequestHandler", () => {
    let feed = null;
    let authSession = null;
    let feedsRequestHandler = null;
    let couchClientInstanceMock = null;
    let dbName = null, body = null;
    let lastIndex = null;
    beforeEach("FeedsRequestHandlerBefore", () => {
        feed = [{
            "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
            "_rev": "1-a1fc119c81b2e042c1fe10721af7ac56",
            "docType": "feed",
            "sourceType": "web",
            "url": "@balaswecha",
            "categoryIds": [
                "95fa167311bf340b461ba414f1004074"
            ],
            "status": "valid"
        }];
        authSession = "Access Token";
        feedsRequestHandler = new FeedsRequestHandler();
        dbName = "dbName";
        lastIndex = 0;
        body = {
            "selector": {
                "sourceUrl": {
                    "$gt": null
                },
                "docType": {
                    "$eq": "feed"
                },
                "pubDate": {
                    "$gt": null
                }
            },
            "fields": ["title", "description", "sourceType", "tags", "pubDate", "enclosures", "images"],
            "skip": 0,
            "sort": [{ "pubDate": "desc" }]
        };
        couchClientInstanceMock = new CouchClient(dbName, authSession);
    });
    afterEach("feedsRequestHandlerAfter", () => {
        CouchClient.createInstance.restore();
        couchClientInstanceMock.findDocuments.restore();
    });

    it("should fetch feeds from the db", async () => {
        try {
            sinon.mock(CouchClient).expects("createInstance").withArgs(authSession).returns(couchClientInstanceMock);
            sinon.mock(couchClientInstanceMock).expects("findDocuments").withArgs(body).returns(Promise.reject("unexpected response from db"));
            await feedsRequestHandler.fetchFeeds(authSession, lastIndex);
            assert.fail();

        } catch (error) {
            assert.equal(error, "unexpected response from db");
        }
    });

    it("should throw an unexpected response from db", async () => {
        try {
            sinon.mock(CouchClient).expects("createInstance").withArgs(authSession).returns(couchClientInstanceMock);
            sinon.mock(couchClientInstanceMock).expects("findDocuments").withArgs(body).returns(Promise.resolve(feed));
            let feeds = await feedsRequestHandler.fetchFeeds(authSession, lastIndex);
            assert.equal(feeds.docType, feed.docType);
            assert.equal(feeds.sourceType, feed.sourceType);
        } catch (error) {
            assert.fail();
        }
    });
});
