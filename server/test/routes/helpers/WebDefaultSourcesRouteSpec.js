import WebDefaultSourcesRoute from "./../../../src/routes/helpers/WebDefaultSourcesRoute";
import RssRequestHandler from "./../../../src/rss/RssRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("WebDefaultSourcesRoute", () => {
    it("should get web default sources", async () => {
        const skip = 0;
        const expectedData = {
            "docs": []
        };
        const request = {
            "query": { "offset": skip }
        };
        const webRoute = new WebDefaultSourcesRoute(request, {}, {});
        const rssHanlderInstance = RssRequestHandler.instance();
        const sandbox = sinon.sandbox.create();
        sandbox.stub(RssRequestHandler, "instance").returns(rssHanlderInstance);
        const defaultSourcesMock = sandbox.mock(rssHanlderInstance).expects("fetchDefaultSources")
            .withExactArgs(skip).returns(Promise.resolve(expectedData));

        const response = await webRoute.handle();

        defaultSourcesMock.verify();
        assert.deepEqual(response, expectedData);
    });
});
