/*eslint no-magic-numbers:0*/
import FetchAllConfiguredFeedsRoute from "../../../src/routes/helpers/FetchAllConfiguredFeedsRoute";
import FetchRequestHandler from "../../../src/fetchAllFeeds/FeedsRequestHandler";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { mockResponse } from "../../helpers/MockResponse";
import { assert } from "chai";
import sinon from "sinon";

describe("FetchAllConfiguredFeedsRoute", () => {
    describe("fetchFeeds", () => {
        let authSession = null, fetchRequestHandlerInstance = null, feeds = null, request = null, response = null;
        let offset = 0, sourceType = null;

        beforeEach("fetch feeds", () => {
            sourceType = "web";
            authSession = "authSession";
            fetchRequestHandlerInstance = new FetchRequestHandler();
            feeds = {
                "docs": [{
                    "_id": "1",
                    "docType": "feed",
                    "sourceType": "web",
                    "name": "url1 test",
                    "url": "http://www.thehindu.com/news/international/?service",
                    "title": "title",
                    "description": "description"
                },
                {
                    "_id": "2",
                    "docType": "feed",
                    "sourceType": "web",
                    "name": "url test",
                    "url": "http://www.thehindu.com/sport/?service",
                    "title": "title",
                    "description": "description"
                }]
            };
            request = {
                "cookies": {
                    "authSession": authSession
                },
                "query": {
                    "offset": offset
                }
            };
        });

        it("should return feeds for correct response", async() => {

            sinon.mock(FetchRequestHandler).expects("instance").returns(fetchRequestHandlerInstance);
            sinon.mock(fetchRequestHandlerInstance).expects("fetchFeeds").returns(Promise.resolve(feeds));

            response = mockResponse();
            let fetchAllConfiguredFeedsRoute = new FetchAllConfiguredFeedsRoute(request, response, {});
            await fetchAllConfiguredFeedsRoute.fetchFeeds();

            assert.deepEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), feeds);

            fetchRequestHandlerInstance.fetchFeeds.restore();
            FetchRequestHandler.instance.restore();
        });

        it("should retrun bad request if fetch feeds reject with an error", async() => {
            response = mockResponse();
            request = {
                "cookies": {
                    "authSession": {}
                },
                "query": {
                    "offset": offset,
                    "sourceType": sourceType
                }
            };
            await new FetchAllConfiguredFeedsRoute(request, response, {}).fetchFeeds();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            assert.deepEqual(response.json(), { "message": "bad request" });
        });
    });
});
