import SearchURLsRoute from "../../../src/routes/helpers/SearchURLsRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("Search Urls Route", () => {
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
                const zero = 0;
                assert.strictEqual("web", expectedValues.json.feeds.docs[zero].sourceType);
                done();
            }
        };
        return response;
    }

    it("should return bad request if url is not present in request", (done) => {
        let request = {
            "query": {
                "url": {}
            }
        };
        let response = mockResponse(done, { "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });

        new SearchURLsRoute(request, response, {}).handle();
    });

    it("should return feeds for correct request", (done) => {
        let sandbox = sinon.sandbox.create();
        let request = {
            "query": {
                "url": {
                    "selector": {
                        "name": {
                            "$regex": "test"
                        }
                    }
                }
            }
        };
        let feeds = { "docs":
        [{ "_id": "1",
            "docType": "test",
            "sourceType": "web",
            "name": "url1 test",
            "url": "http://www.thehindu.com/news/international/?service" },
            { "_id": "2",
                "docType": "test",
                "sourceType": "web",
                "name": "url test",
                "url": "http://www.thehindu.com/sport/?service" }]
        };
        let requestHandlerInstance = new RssRequestHandler();
        sandbox.stub(RssRequestHandler, "instance").returns(requestHandlerInstance);
        let requestHandlerMock = sandbox.mock(requestHandlerInstance).expects("searchUrl");
        requestHandlerMock.withArgs(request.query.url).returns(Promise.resolve(feeds));
        let response = mockResponseSuccess(done, { "status": HttpResponseHandler.codes.OK, "json": { feeds } });
        let searchURLsRoute = new SearchURLsRoute(request, response, {});
        searchURLsRoute.handle();
        sandbox.restore();
    });
});
