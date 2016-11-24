import AddURLDocumentRoute from "../../../src/routes/helpers/AddURLDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
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
            "body": {
                "query": {
                    "url": {
                        "name": null
                    }
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

        let document = {
            "id": request.body.query.url.name,
            "sourceType": "web",
            "url": request.body.query.url
        };

        let rssRequestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(rssRequestHandlerInstance);
        let requestHandlerMock = sandbox.mock(rssRequestHandlerInstance).expects("addDocument");
        requestHandlerMock.withArgs(request.body.query.url.name, request.body.query.url).returns(Promise.resolve(document));

        let response = mockResponseSuccess(done, {
            "status": HttpResponseHandler.codes.OK,
            "json": { document }
        });

        new AddURLDocumentRoute(request, response, {}).handle();
        sandbox.restore();
    });

});
