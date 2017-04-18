import SearchURLsRoute from "../../../src/routes/helpers/SearchURLsRoute";
import RssRequestHandler from "../../../src/rss/RssRequestHandler";
import { assert } from "chai";
import sinon from "sinon";

describe("Search Urls Route", () => {
    it("should fetch search results", async () => {
        const request = {
            "query": {
                "keyword": "Test",
                "offset": ""
            }
        };

        const feeds = {
            "docs": [{
                "_id": "1",
                "docType": "test",
                "sourceType": "web",
                "name": "test url1",
                "url": "http://www.thehindu.com/news/international/?service"
            }, {
                "_id": "2",
                "docType": "test",
                "sourceType": "web",
                "name": "test url2",
                "url": "http://www.thehindu.com/sport/?service"
            }]
        };

        const ZERO = 0;
        const sandbox = sinon.sandbox.create();
        const requestHandlerInstance = new RssRequestHandler();

        sandbox.stub(RssRequestHandler, "instance").returns(requestHandlerInstance);
        const requestHandlerMock = sandbox.mock(requestHandlerInstance).expects("searchUrl");

        requestHandlerMock.withExactArgs(request.query.keyword, ZERO).returns(Promise.resolve(feeds));

        let searchURLsRoute = new SearchURLsRoute(request, {}, {});
        const result = await searchURLsRoute.handle();

        requestHandlerMock.verify();
        assert.deepEqual(result, feeds);

        sandbox.restore();
    });
});
