import FetchFeedsFromHashtag from "../../src/fetchAllFeeds/FetchFeedsFromHashtag";
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import { mockResponse } from "../helpers/MockResponse";

describe("FetchFeedsFromHashtag", () => {
    let sandbox = null, fetchFeedsFromHashtag = null, feed = null;

    beforeEach("FetchFeedsFromHashtag", () => {
        sandbox = sinon.sandbox.create();
        let request = {
            "cookies": {
                "AuthSession": "authSession"
            },
            "body": {
                "hashtag": "#hashtag"
            }
        };
        let response = mockResponse();
        fetchFeedsFromHashtag = new FetchFeedsFromHashtag(request, response);
    });

    afterEach("FetchFeedsFromHashtag", () => {
        sandbox.restore();
    });

    it("should return feeds for valid twitter hashtag", async() => {
        feed = [{ "sourceType": "twitter", "_id": "@TheHindu", "latestFeedTimeStamp": "12344568", "docType": "feed" }];
        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
        twitterRequestHandlerMock.returns(twitterRequestHandler);
        let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest")
            .withArgs("#hashtag", "", "authSession");
        fetchTwitterFeedRequestMock.returns(Promise.resolve(feed));
        try {
            let result = await fetchFeedsFromHashtag.handle();
            assert.deepEqual(result, feed);
        } catch(error) {
            assert.fail(error);
        }
    });

    it("should return empty array for invalid twitter hashtag", async() => {
        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("instance");
        twitterRequestHandlerMock.returns(twitterRequestHandler);
        let fetchTwitterFeedRequestMock = sandbox.mock(twitterRequestHandler).expects("fetchTweetsRequest")
            .withArgs("#hashtag", "", "authSession");
        fetchTwitterFeedRequestMock.returns(Promise.reject("error"));
        try {
            let result = await fetchFeedsFromHashtag.handle();
            assert.deepEqual(result, []);
        } catch(error) {
            assert.fail(error);
        }
    });
});
