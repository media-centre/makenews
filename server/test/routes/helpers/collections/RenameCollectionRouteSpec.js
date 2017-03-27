import RenameCollectionRoute from "../../../../src/routes/helpers/collections/RenameCollectionRoute";
import CollectionRequestHandler from "./../../../../src/collection/CollectionRequestHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("RenameCollectionRoute", () => {
    const sandbox = sinon.sandbox.create();
    const accessToken = "accessToken";
    let renameCollection = null, request = null;

    afterEach("RenameCollectionRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should return empty string if all parameters are there", () => {
            request = {
                "cookies": {
                    "AuthSession": accessToken
                },
                "body": {
                    "newCollectionName": "collection",
                    "collectionId": "12343"
                }
            };
            renameCollection = new RenameCollectionRoute(request, {});

            assert.strictEqual(renameCollection.validate(), "");
        });

        it("should return missing parameters message", () => {
            request = {
                "cookies": {
                    "AuthSession": accessToken
                },
                "body": {
                    "collectionId": "12343"
                }
            };

            renameCollection = new RenameCollectionRoute(request, {});

            assert.strictEqual(renameCollection.validate(), "missing parameters");
        });
    });

    describe("handle", () => {
        it("should rename the collection", async () => {
            const collectionReqHandler = CollectionRequestHandler.instance();
            sandbox.stub(CollectionRequestHandler, "instance").returns(collectionReqHandler);

            request = {
                "cookies": {
                    "AuthSession": accessToken
                },
                "body": {
                    "newCollectionName": "collection",
                    "collectionId": "12343"
                }
            };
            const renameMock = sandbox.mock(collectionReqHandler).expects("renameCollection")
                .withExactArgs(accessToken, "12343", "collection").returns(Promise.resolve({ "ok": true }));
            renameCollection = new RenameCollectionRoute(request, {});

            const response = await renameCollection.handle();

            renameMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });
});
