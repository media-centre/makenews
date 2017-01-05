import { assert } from "chai";
import TwitterHandlesRoute from "../../../src/routes/helpers/TwitterHandlesRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterRequestHandler from "../../../src/twitter/TwitterRequestHandler";
import RouteLogger from "../../../src/routes/RouteLogger";
import LogTestHelper from "../../helpers/LogTestHelper";
import { mockResponse } from "../../helpers/MockResponse";
import sinon from "sinon";

describe("TwitterHandlesRoute", () => {

    let sandbox = null, pageNumber = null, twitterPreFirstId = null;
    beforeEach("TwitterHandlesRoute", () => {
        sandbox = sinon.sandbox.create();
        pageNumber = 1;  //eslint-disable-line no-magic-numbers
        twitterPreFirstId = 123; //eslint-disable-line no-magic-numbers
        sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("TwitterHandlesRoute", () => {
        sandbox.restore();
    });

    it("should return the handles data from the twitter user", async()=> {
        let response = mockResponse();
        let request = {
            "cookies": {
                "AuthSession": "Authsession"
            },
            "query": {
                "keyword": "test",
                "page": pageNumber,
                "twitterPreFirstId": twitterPreFirstId
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
        sandbox.mock(twitterRequestHandlerInstance).expects("fetchHandlesRequest").withExactArgs("Authsession", "test", pageNumber, twitterPreFirstId).returns(Promise.resolve(data));

        await new TwitterHandlesRoute(request, response).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), data);
    });

    it("should return bad request if the if fetch handles reject with an error", async() => {
        let response = mockResponse();

        let request = {
            "cookies": {
                "AuthSession": "Authsession"
            },
            "query": {
                "keyword": "test",
                "page": pageNumber,
                "twitterPreFirstId": twitterPreFirstId
            }
        };
        let twitterRequestHandlerInstance = new TwitterRequestHandler();
        sandbox.stub(TwitterRequestHandler, "instance").returns(twitterRequestHandlerInstance);
        sandbox.mock(twitterRequestHandlerInstance).expects("fetchHandlesRequest")
            .withExactArgs("auth session", "test", pageNumber, twitterPreFirstId).returns(Promise.reject("error"));

        await new TwitterHandlesRoute(request, response).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
    });
});
