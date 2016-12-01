import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import sinon from "sinon";
import { expect } from "chai";

describe("Add URL Document Route", () => {
    function mockResponse(expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
            }
        };
        return response;
    }

    function mockResponseSuccess(expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
            }
        };
        return response;
    }


    it("should return bad request if URL is not valid", async() => {
        let request = {
            "body": {
                "url": ""
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        let response = mockResponse({
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        await new AddURLDocumentRoute(request, response, {}).handle();

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
        let response = mockResponse({
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        await new AddURLDocumentRoute(request, response, {}).handle();

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

        let rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURL");
        requestHandlerMock.withArgs(request.body.url).returns(Promise.resolve({ "message": "URL added to Database" }));

        let response = mockResponseSuccess({
            "status": HttpResponseHandler.codes.OK,
            "json": { "message": "URL added to Database" }
        });

        await new AddURLDocumentRoute(request, response, {}).handle();
        sandbox.restore();
    });

});
