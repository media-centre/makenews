import FetchAllConfiguredFeedsRoute from "../../../src/routes/helpers/FetchAllConfiguredFeedsRoute";
import FetchRequestHandler from "../../../src/fetchAllFeeds/FeedsRequestHandler";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { assert, expect } from "chai";
import sinon from "sinon";

describe("FetchAllConfiguredFeedsRoute", () => {
    describe("fetchFeeds", () => {
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
                    assert.strictEqual("feed", expectedValues.json.feeds.docs[zero].docType);
                }
            };
            return response;
        }

        it("should return feeds for correct response", async () => {
            let authSession = "authSession";
            let fetchRequestHandlerInstance = new FetchRequestHandler();
            let feeds = {
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
            let request = {
                "cookies": {
                    "authSession": authSession
                }
            };
            try {
                sinon.mock(FetchRequestHandler).expects("instance").returns(fetchRequestHandlerInstance);
                sinon.mock(fetchRequestHandlerInstance).expects("fetchFeeds").returns(Promise.resolve(feeds));
                let response = mockResponseSuccess({ "status": HttpResponseHandler.codes.OK, "json": { feeds } });
                let fetchAllConfiguredFeedsRoute = new FetchAllConfiguredFeedsRoute(request, response, {});
                await fetchAllConfiguredFeedsRoute.fetchFeeds();

            } catch (error) {
                assert.fail(error);
            } finally {
                fetchRequestHandlerInstance.fetchFeeds.restore();
                FetchRequestHandler.instance.restore();
            }
        });

        it("should retrun bad request if fetch feeds reject with an error", async () => {
            let response = mockResponse({ "status": HttpResponseHandler.codes.BAD_REQUEST, "json": { "message": "bad request" } });
            let request = {
                "cookies": {
                    "authSession": {}
                }
            };
            await new FetchAllConfiguredFeedsRoute(request, response, {}).fetchFeeds();
        });
    });
});
