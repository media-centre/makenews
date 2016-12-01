import FeedsRequestHandler from "../../src/fetchAllFeeds/FeedsRequestHandler";
import FeedsClient from "../../src/fetchAllFeeds/FeedsClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FeedsRequestHandler", () => {
    let feed = null;
    let authSession = null;
    let feedClientMock = null;
    let feedsRequestHandler = null;
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
        feedClientMock = new FeedsClient();
        feedsRequestHandler = new FeedsRequestHandler();
    });
    afterEach("feedsRequestHandlerAfter", () => {
        FeedsClient.instance.restore();
        feedClientMock.getFeeds.restore();
    });

    it("should fetch feeds from the db", async () => {
        try {
            sinon.mock(FeedsClient).expects("instance").returns(feedClientMock);
            sinon.mock(feedClientMock).expects("getFeeds").withArgs(authSession).returns(Promise.resolve(feed));
            let feeds = await feedsRequestHandler.fetchFeeds(authSession);
            assert.equal(feeds.docType, feed.docType);
        } catch (error) {
            assert.fail(error);
        }
    });

    it("should throw an unexpected response from db", async () => {
        try {
            sinon.mock(FeedsClient).expects("instance").returns(feedClientMock);
            sinon.mock(feedClientMock).expects("getFeeds").withArgs(authSession).returns(Promise.reject("unexpected response from db"));
            await feedsRequestHandler.fetchFeeds(authSession);
            assert.fail();
        } catch (error) {
            assert.equal(error, "unexpected response from db");
        }
    });
});
