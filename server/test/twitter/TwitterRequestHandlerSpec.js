/* eslint no-magic-numbers:0 */
import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import TwitterClient from "../../src/twitter/TwitterClient";
import { userDetails } from "../../src/Factory";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterRequestHandler", () => {
    let sandbox = null, userName = null, userObj = null, keyword = null, page = null, preFirstId = null;
    beforeEach("TwitterRequestHandler", () => {
        sandbox = sinon.sandbox.create();
        userName = "testUser";
        userObj = { "userName": userName };
        keyword = "keyword";
        page = 1;
        preFirstId = 123;
        sandbox.mock(userDetails).expects("getUser").returns(userObj);
    });

    afterEach("TwitterRequestHandler", () => {
        sandbox.restore();
    });

    it("should fetch handles list from the twitter", async() => {
        let handles = {
            "users": [{
                "id": "test",
                "name": "testAccount",
                "url": "https:/t.co/ijad"
            }]
        };

        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterClientInstance = new TwitterClient();
        sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
        sandbox.mock(twitterClientInstance).expects("fetchHandles").withExactArgs(userName, keyword, page, preFirstId).returns(Promise.resolve(handles));
        let data = await twitterRequestHandler.fetchHandlesRequest(userName, keyword, page, preFirstId);
        assert.strictEqual(data, handles);

    });

    it("should reject with an error if fetch handles from twitter throws an error", async() => {
        let twitterRequestHandler = new TwitterRequestHandler();
        let twitterClientInstance = new TwitterClient();
        sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
        sandbox.mock(twitterClientInstance).expects("fetchHandles").withExactArgs(userName, keyword, page, preFirstId).returns(Promise.reject("Error"));
        try{
            await twitterRequestHandler.fetchHandlesRequest(userName, keyword, page, preFirstId);
        } catch (error) {
            assert.strictEqual(error, "Error");
        }

    });
});
