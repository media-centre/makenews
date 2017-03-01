import SearchFeedsRoute from "./../../../src/routes/helpers/SearchFeedsRoute";
import FeedsRequestHandler from "./../../../src/fetchAllFeeds/FeedsRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("Search Feeds Route", () => {
    let sourceType = null, searchkey = null, accessToken = null, feeds = null;
    let sandbox = null;

    it("should return feeds", async() => {
        sandbox = sinon.sandbox.create();
        sourceType = "web";
        searchkey = "test";
        accessToken = "test_token";
        feeds = "feeds";

        let request = {
            "cookies": { "AuthSession": accessToken },
            "query": { sourceType, searchkey }
        };
        let searchFeed = new SearchFeedsRoute(request, {});

        let requestHandleInstance = new FeedsRequestHandler();
        sandbox.mock(FeedsRequestHandler).expects("instance").returns(requestHandleInstance);
        sandbox.mock(requestHandleInstance).expects("searchFeeds").returns(feeds);

        let result = await searchFeed.process();
        assert.equal(result, feeds);
    });
});
