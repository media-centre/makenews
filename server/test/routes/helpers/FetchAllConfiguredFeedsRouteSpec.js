/*eslint no-magic-numbers:0*/
import FetchAllConfiguredFeedsRoute from "../../../src/routes/helpers/FetchAllConfiguredFeedsRoute";
import FetchRequestHandler from "../../../src/fetchAllFeeds/FeedsRequestHandler";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import mockResponse from "../../helpers/MockResponse";
import { assert, expect } from "chai";
import sinon from "sinon";

describe("FetchAllConfiguredFeedsRoute", () => {
    let authSession = null, fetchRequestHandlerInstance = null, feeds = null, request = null, response = null;
    let lastIndex = 0;

    beforeEach("FetchAllConfiguredFeedsRoute", () => {
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
            "body": {
                "lastIndex": lastIndex
            }
        };
    });

    describe("fetchFeeds", () => {
        it("should return feeds for correct response", async () => {

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

        it("should retrun bad request if fetch feeds reject with an error", async () => {
            response = mockResponse();
            request = {
                "cookies": {
                    "authSession": {}
                },
                "body": {
                    "lastIndex": lastIndex
                }
            };
            await new FetchAllConfiguredFeedsRoute(request, response, {}).fetchFeeds();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            assert.deepEqual(response.json(), { "message": "bad request" });
        });
    });

    describe("Last Index", () => {
        let fetchAllConfiguredFeedsRoute = null;

        beforeEach("Last Index", () => {
            response = mockResponse();
            fetchAllConfiguredFeedsRoute = new FetchAllConfiguredFeedsRoute(request, response, {});
        });

        it("index should return zero if it is not a number", () => {
            lastIndex = "test";
            expect(fetchAllConfiguredFeedsRoute.index()).to.equal(0);
        });

        it("index should return zero if it is a negative number", () => {
            lastIndex = -1;
            expect(fetchAllConfiguredFeedsRoute.index()).to.equal(0);
        });

        it("index should return index", () => {
            request = {
                "cookies": {
                    "authSession": authSession
                },
                "body": {
                    "lastIndex": 2
                }
            };
            fetchAllConfiguredFeedsRoute = new FetchAllConfiguredFeedsRoute(request, response, {});

            expect(fetchAllConfiguredFeedsRoute.index()).to.equal(2);
        });
    });
});
