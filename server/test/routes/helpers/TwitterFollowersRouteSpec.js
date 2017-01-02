import { assert } from "chai";
import TwitterFollowersRoute from "../../../src/routes/helpers/TwitterFollowersRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterRequestHandler from "../../../src/twitter/TwitterRequestHandler";
import RouteLogger from "../../../src/routes/RouteLogger";
import LogTestHelper from "../../helpers/LogTestHelper";
import mockResponse from "../../helpers/MockResponse";
import sinon from "sinon";

xdescribe("TwitterFollowersRoute", () => {

    let sandbox = null;
    beforeEach("TwitterFollowersRoute", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("TwitterFollowersRoute", () => {
        sandbox.restore();
    });

    it("should return the followers data from the twitter user", async()=> {
        let response = mockResponse();

        let request = {
            "cookies": {
                "AuthSession": "Authsession"
            }
        };
        let data = {
            "users": [{
                "id": "test",
                "name": "testAccount",
                "url": "https:/t.co/ijad"
            }]
        };
        let twitterRequestHandlerInstance = new TwitterRequestHandler();
        sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandlerInstance);
        sandbox.mock(twitterRequestHandlerInstance).expects("fetchFollowersRequest").withArgs("AuthSession").returns(Promise.resolve(data));

        await new TwitterFollowersRoute(request, response).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), data);
    });

    it("should return bad request if the if fetch followers reject with an error", async() => {
        let response = mockResponse();

        let request = {
            "query": {
                "userName": ""
            }
        };

        await new TwitterFollowersRoute(request, response).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
    });
});
