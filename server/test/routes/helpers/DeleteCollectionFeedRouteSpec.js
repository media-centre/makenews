import DeleteCollectionFeedRoute from "../../../src/routes/helpers/DeleteCollectionFeedRoute";
import * as CollectionFeedsRequestHandler from "../../../src/collection/CollectionFeedsRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("DeleteCollectionFeedRoute", () => {
    const sandbox = sinon.sandbox.create();
    const accessToken = "accessToken";
    const feedId = "feedId";
    const intermediateDocId = "intermediateDocId";
    let deleteFeed = null, request = null;
    beforeEach("DeleteCollectionFeedRoute", () => {
        request = {
            "cookies": {
                "AuthSession": accessToken
            },
            "query": {
                intermediateDocId,
                feedId
            }
        };

    });

    afterEach("DeleteCollectionFeedRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {

        it("should return empty string if all parameters are there", () => {
            deleteFeed = new DeleteCollectionFeedRoute(request, {});

            assert.strictEqual(deleteFeed.validate(), "");
        });

        it("should return missing parameters message", () => {
            request.query.intermediateDocId = "";

            deleteFeed = new DeleteCollectionFeedRoute(request, {});

            assert.strictEqual(deleteFeed.validate(), "missing parameters");
        });
    });

    describe("handle", () => {

        it("should delete feed from collection", async () => {
            let deleteArticleMock = sandbox.mock(CollectionFeedsRequestHandler).expects("deleteFeedFromCollection")
               .withExactArgs(accessToken, intermediateDocId, feedId).returns(Promise.resolve({ "ok": true }));

            deleteFeed = new DeleteCollectionFeedRoute(request, {});

            let response = await deleteFeed.handle();

            deleteArticleMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });
});
