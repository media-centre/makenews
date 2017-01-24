import AddStoryTitleRoute from "../../../src/routes/helpers/AddStoryTitleRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import StoryRequestHandler from "../../../src/storyBoard/StoryRequestHandler";
import { mockResponse } from "../../helpers/MockResponse";
import sinon from "sinon";
import { assert } from "chai";

describe("Add Story Document Route", () => {
    it("should return bad request if title is not valid", async() => {
        let request = {
            "body": {
                "title": ""
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        let response = mockResponse();
        await new AddStoryTitleRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        assert.deepEqual(response.json(), { "message": "missing parameters" });

    });

    it("should return bad request if AuthSession is empty", async() => {
        let request = {
            "body": {
                "url": "test"
            },
            "cookies": {
                "AuthSession": ""
            }
        };
        let response = mockResponse();
        await new AddStoryTitleRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        assert.deepEqual(response.json(), { "message": "missing parameters" });
    });


    it("should add document for correct request", async() => {
        let sandbox = sinon.sandbox.create();
        let request = {
            "body": {
                "title": "http://test.com/rss"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        let successObject = {
            "ok": true,
            "_id": "1234",
            "rev": "1234"
        };
        let response = mockResponse();

        let storyRequestHandlerInstance = new StoryRequestHandler();
        sandbox.stub(StoryRequestHandler, "instance").returns(storyRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(storyRequestHandlerInstance).expects("addStory");
        requestHandlerMock.withArgs(request.body.title).returns(Promise.resolve(successObject));

        await new AddStoryTitleRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), successObject);
        sandbox.restore();
    });

});
