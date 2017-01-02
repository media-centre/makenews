import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import { mockResponse } from "../../helpers/MockResponse";
import sinon from "sinon";
import { assert } from "chai";

describe("Add URL Document Route", () => {
    it("should return bad request if URL is not valid", async() => {
        let request = {
            "body": {
                "url": ""
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        let response = mockResponse();
        await new AddURLDocumentRoute(request, response, {}).handle();
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
        await new AddURLDocumentRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        assert.deepEqual(response.json(), { "message": "missing parameters" });
    });


    it("should add document for correct request", async() => {
        let sandbox = sinon.sandbox.create();
        let request = {
            "body": {
                "url": "http://test.com/rss"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };

        let response = mockResponse();

        let rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURL");
        requestHandlerMock.withArgs(request.body.url).returns(Promise.resolve({ "message": "URL added to Database" }));

        await new AddURLDocumentRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), { "message": "URL added to Database" });
        sandbox.restore();
    });

});
