import RenameCollectionRoute from "../../../../src/routes/helpers/collections/RenameCollectionRoute";
import CollectionRequestHandler from "./../../../../src/collection/CollectionRequestHandler";
import CouchClient from "../../../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("RenameCollectionRoute", () => {
    let couchClient = null, authSession = null, sandbox = null, collectionReqHandler = null;
    let renameCollection = null, request = null;

    beforeEach("CollectionRoute", () => {
        sandbox = sinon.sandbox.create();
        authSession = "auth session";
        couchClient = new CouchClient(authSession);
        sandbox.mock(CouchClient).expects("instance").withExactArgs(authSession).returns(couchClient);
        collectionReqHandler = new CollectionRequestHandler(couchClient);
        sandbox.mock(CollectionRequestHandler).expects("instance").withExactArgs(couchClient).returns(collectionReqHandler);
    });

    afterEach("RenameCollectionRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should return empty string if all parameters are there", () => {
            request = {
                "cookies": {
                    "AuthSession": authSession
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
                    "AuthSession": authSession
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

            request = {
                "cookies": {
                    "AuthSession": authSession
                },
                "body": {
                    "newCollectionName": "collection",
                    "collectionId": "12343"
                }
            };
            const renameMock = sandbox.mock(collectionReqHandler).expects("renameCollection")
                .withExactArgs("12343", "collection").returns(Promise.resolve({ "ok": true }));
            renameCollection = new RenameCollectionRoute(request, {});

            const response = await renameCollection.handle();

            renameMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });
});
