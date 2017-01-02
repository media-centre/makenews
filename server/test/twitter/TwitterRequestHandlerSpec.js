import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import TwitterClient from "../../src/twitter/TwitterClient";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterRequestHandler", () => {
    let sandbox = null;
    beforeEach("TwitterRequestHandler", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("TwitterRequestHandler", () => {
        sandbox.restore();
    });

    xit("should fetch followers list from the twitter", async() => {
        let followers = {
            "users": [{
                "id": "test",
                "name": "testAccount",
                "url": "https:/t.co/ijad"
            }]
        };
        let userName = "testUser";
        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterClientInstance = new TwitterClient();
        sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
        sandbox.mock(twitterClientInstance).expects("fetchFollowers").returns(Promise.resolve(followers));

        let data = await twitterRequestHandler.fetchFollowersRequest(userName);
        assert.strictEqual(data, followers);

    });

    xit("should reject with an error if fetchinf followers from twitter throws an error", async() => {
        let userName = "testUser";
        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterClientInstance = new TwitterClient();
        sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
        sandbox.mock(twitterClientInstance).expects("fetchFollowers").returns(Promise.reject("Error"));
        try{
            await twitterRequestHandler.fetchFollowersRequest(userName);
        } catch (error) {
            assert.strictEqual(error, "Error");
        }

    });
});
