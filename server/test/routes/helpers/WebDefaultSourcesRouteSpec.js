import WebDefaultSourcesRoute from "./../../../src/routes/helpers/WebDefaultSourcesRoute";
import RssRequestHandler from "./../../../src/rss/RssRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("WebDefaultSourcesRoute", () => {
    it("should get web default sources", async () => {
        const expectedData = {
            "docs": []
        };
        const webRoute = new WebDefaultSourcesRoute({}, {}, {});
        const rssHanlderInstance = RssRequestHandler.instance();
        const sandbox = sinon.sandbox.create();
        sandbox.stub(RssRequestHandler, "instance").returns(rssHanlderInstance);
        const defaultSourcesMock = sandbox.mock(rssHanlderInstance).expects("fetchDefaultSources")
            .returns(Promise.resolve(expectedData));

        const response = await webRoute.handle();

        defaultSourcesMock.verify();
        assert.deepEqual(response, expectedData);
    });
});
