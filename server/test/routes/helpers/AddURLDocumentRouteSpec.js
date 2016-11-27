import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import sinon from "sinon";
import { expect } from "chai";

describe("Add URL Document Route", () => {
    function mockResponse(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
                done();
            }
        };
        return response;
    }

    function mockResponseSuccess(done, expectedValues) {
        let response = {
            "status": (status) => {
                expect(status).to.equal(expectedValues.status);
            },
            "json": (jsonData) => {
                expect(jsonData).to.deep.equal(expectedValues.json);
                done();
            }
        };
        return response;
    }


    it("should return bad request if URL is not valid", (done) => {
        let request = {
            "body": {
                "query": {
                    "url": "Invalid url"
                }
            }
        };
        let response = mockResponse(done, {
            "status": HttpResponseHandler.codes.BAD_REQUEST,
            "json": { "message": "bad request" }
        });
        new AddURLDocumentRoute(request, response, {}).handle();

    });

    it("should add document for correct request", (done) => {
        let sandbox = sinon.sandbox.create();
        let request = {
            "body": {
                "query": {
                    "url": {
                        "name": "test"
                    }
                }
            }
        };

        let rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addURL");
        requestHandlerMock.withArgs(request.body.query.url).returns(Promise.resolve({ "message": "URL added to Database" }));

        let response = mockResponseSuccess(done, {
            "status": HttpResponseHandler.codes.OK,
            "json": { "message": "URL added to Database" }
        });

        new AddURLDocumentRoute(request, response, {}).handle();
        sandbox.restore();
    });

});
