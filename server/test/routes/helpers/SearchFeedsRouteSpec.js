import SearchFeedsRoute from "./../../../src/routes/helpers/SearchFeedsRoute";
import FeedsRequestHandler from "./../../../src/fetchAllFeeds/FeedsRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("Search Feeds Route", () => {
    let sourceType = null;
    let searchkey = null;
    let accessToken = null;
    let feeds = null;
    let sandbox = null;

    it("should return feeds", async() => {
        sandbox = sinon.sandbox.create();
        sourceType = "web";
        searchkey = "test";
        accessToken = "test_token";
        feeds = "feeds";

        const request = {
            "cookies": { "AuthSession": accessToken },
            "query": { sourceType, searchkey }
        };
        const searchFeed = new SearchFeedsRoute(request, {});

        const requestHandleInstance = new FeedsRequestHandler();
        sandbox.mock(FeedsRequestHandler).expects("instance").returns(requestHandleInstance);
        sandbox.mock(requestHandleInstance).expects("searchFeeds").returns(feeds);

        const result = await searchFeed.handle();
        assert.equal(result, feeds);
    });
});
