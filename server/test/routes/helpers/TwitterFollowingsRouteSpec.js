import TwitterFollowingsRoute from "./../../../src/routes/helpers/TwitterFollowingsRoute";
import TwitterRequestHandler from "./../../../src/twitter/TwitterRequestHandler";
import { assert } from "chai";
import sinon from "sinon";

describe("TwitterFollowingsRoute", () => {

    it("should get followings", async () => {
        let sandbox = sinon.sandbox.create();
        const authSession = "authSession";
        const nextCursor = -1;
        const request = {
            "cookies": {
                "AuthSession": authSession
            },
            "query": {
                "page": nextCursor
            }
        };

        const expectedHandles = {
            "docs": [],
            "paging": { "page": 0 }
        };
        const twitterRequestHandler = TwitterRequestHandler.instance();
        sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandler);
        const fetchFollowingsMock = sandbox.mock(twitterRequestHandler).expects("fetchFollowings")
            .withExactArgs(authSession, nextCursor).returns(expectedHandles);
        const twitterFollowing = new TwitterFollowingsRoute(request, {});
        const response = await twitterFollowing.handle();

        fetchFollowingsMock.verify();
        assert.deepEqual(response, expectedHandles);

        sandbox.restore();
    });
});
