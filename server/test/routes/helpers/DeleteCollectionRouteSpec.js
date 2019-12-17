import DeleteCollectionRoute from "../../../src/routes/helpers/DeleteCollectionRoute";
import * as CollectionFeedsRequestHandler from "../../../src/collection/CollectionFeedsRequestHandler";
import { expect } from "chai";
import sinon from "sinon";

describe("DeleteCollectionRoute", () => {
    describe("validate", () => {
        const collection = "bsjzueer1_1jshguejsnmgjeu";
        const authSession = "test_token";
        it("should return error message of missing params if collection Name is empty", () => {
            const request = {
                "cookies": { "AuthSession": authSession },
                "query": {
                    "collection": ""
                }
            };
            const deleteCollection = new DeleteCollectionRoute(request, {});

            expect(deleteCollection.validate()).to.equal("missing parameters");
        });

        it("should return error message of missing params if auth session is empty", () => {
            const request = {
                "cookies": { "AuthSession": "" },
                "query": {
                    collection
                }
            };
            const deleteCollection = new DeleteCollectionRoute(request, {});

            expect(deleteCollection.validate()).to.equal("missing parameters");
        });
    });

    describe("handle", () => {
        let sandbox = null;
        const authSession = "test_token";

        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should delete the collection", async() => {
            const collection = "bsjzueer1_1jshguejsnmgjeu";
            const request = {
                "cookies": { "AuthSession": authSession },
                "query": { collection }
            };
            const deleteCollection = new DeleteCollectionRoute(request, {});

            sandbox.mock(CollectionFeedsRequestHandler).expects("deleteCollection")
                .withExactArgs(authSession, collection).returns(Promise.resolve({ "ok": true }));

            const result = await deleteCollection.handle();
            expect(result).to.deep.equal({ "ok": true });
        });
    });
});
