import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import { mockResponse } from "../../helpers/MockResponse";
import sinon from "sinon";
import { assert } from "chai";

describe("Add URL Document Route", () => {
    it("should return bad request if URL is not valid", async() => {
        const request = {
            "body": {
                "url": ""
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        const response = mockResponse();
        await new AddURLDocumentRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        assert.deepEqual(response.json(), { "message": "missing parameters" });

    });

    it("should return bad request if AuthSession is empty", async() => {
        const request = {
            "body": {
                "url": "test"
            },
            "cookies": {
                "AuthSession": ""
            }
        };
        const response = mockResponse();
        await new AddURLDocumentRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
        assert.deepEqual(response.json(), { "message": "missing parameters" });
    });


    it("should add document for correct request", async() => {
        const sandbox = sinon.sandbox.create();
        const request = {
            "body": {
                "url": "http://test.com/rss"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };

        const response = mockResponse();

        const rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        const requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURL");
        requestHandlerMock.withArgs(request.body.url).returns(Promise.resolve({ "message": "URL added to Database" }));

        await new AddURLDocumentRoute(request, response, {}).handle();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), { "message": "URL added to Database" });
        sandbox.restore();
    });

    it("should reject with error if add document throws an error", async() => {
        const sandbox = sinon.sandbox.create();
        const request = {
            "body": {
                "url": "http://test.com/rss"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };

        const response = mockResponse();

        const rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        const requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURL");
        requestHandlerMock.withArgs(request.body.url).returns(Promise.reject("URL already exists"));

        try {
            await new AddURLDocumentRoute(request, response, {}).handle();
            requestHandlerMock.verify();
            assert.fail();
        } catch(err) {
            assert.deepEqual(response.json(), { "message": "URL already exists" });
            sandbox.restore();
        }
    });

});
