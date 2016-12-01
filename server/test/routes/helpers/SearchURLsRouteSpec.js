import SearchURLsRoute from "../../../src/routes/helpers/SearchURLsRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import { expect, assert } from "chai";
import sinon from "sinon";

describe("Search Urls Route", () => {
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
            "json": () => {
                const zero = 0;
                assert.strictEqual("web", expectedValues.json.feeds.docs[zero].sourceType);
            }
        };
        return response;
    }

    it("should return bad request if url is not present in request", async () => {
        let request = {
            "query": {
                "key": ""
            }
        };
        let response = mockResponse({ "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });

        await new SearchURLsRoute(request, response, {}).handle();
    });

    it("should return feeds for correct request", async () => {
        let sandbox = sinon.sandbox.create();
        let request = {
            "query": {
                "key": "The"
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
        requestHandlerMock.withArgs(request.query.key).returns(Promise.resolve(feeds));
        let response = mockResponseSuccess({ "status": HttpResponseHandler.codes.OK, "json": { feeds } });
        let searchURLsRoute = await new SearchURLsRoute(request, response, {});
        searchURLsRoute.handle();
        sandbox.restore();
    });
});
