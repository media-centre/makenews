import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import WebRequestHandler from "../../../src/web/WebRequestHandler";
import sinon from "sinon";
import { expect, assert } from "chai";

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
            "json": () => {
                assert.strictEqual("web", expectedValues.json.document.sourceType);
                done();
            }
        };
        return response;
    }


    it("should return bad request if URL is not valid", (done) => {
        let request = {
            "query": {
                "url": {
                    "name": {}
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
            "query": {
                "url": {
                    "name": "test"
                }
            }
        };

        let document = {
            "id": request.query.url.name,
            "sourceType": "web",
            "url": request.query.url
        };

        let webRequestHandlerInstance = new WebRequestHandler();
        sandbox.stub(WebRequestHandler, "instance").returns(webRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(webRequestHandlerInstance).expects("addDocument");
        requestHandlerMock.withArgs(request.query.url.name, request.query.url).returns(Promise.resolve(document));

        let response = mockResponseSuccess(done, {
            "status": HttpResponseHandler.codes.OK,
            "json": { document }
        });

        new AddURLDocumentRoute(request, response, {}).handle();
        sandbox.restore();
    });

});
