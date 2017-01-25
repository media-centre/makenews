import CollectionRequestHandler from "../../src/collection/CollectionRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("CollectionRequestHandler", () => {
    describe("updateCollection", () => {
        let collectionRequestHandler = null, authSession = null, docId = null, collectionName = null;
        let sandbox = null, couchClient = null;
        beforeEach("updateCollection", () => {
            authSession = "auth session";
            docId = "doc id";
            collectionName = "collection name";
            collectionRequestHandler = new CollectionRequestHandler();
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient(authSession);
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
        });

        afterEach("updateCollection", () => {
            sandbox.restore();
        });

        it("should throw error if isNewCollection is true and collection id Exist", async () => {
            let collectionDoc = [{ "_id": "collection id", "collection": "first collection" }];
            let findDocMock = sandbox.mock(couchClient).expects("findDocuments")
                .returns(Promise.resolve({ "docs": collectionDoc }));

            try {
                let response = await collectionRequestHandler.updateCollection(authSession, docId, collectionName, true);
                assert.deepEqual(response, { "message": "collection already exist" });
                findDocMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should create doc when there is isCollection is false or no collectionId", async () => {
            let createCollectionMock = sandbox.mock(collectionRequestHandler).expects("createCollection")
                .returns(Promise.resolve({ "ok": true }));
            let findDocMock = sandbox.mock(couchClient).expects("findDocuments")
                .returns(Promise.resolve({ "docs": [] }));

            try {
                let response = await collectionRequestHandler.updateCollection(authSession, docId, collectionName, false);
                assert.deepEqual(response, { "ok": true });
                createCollectionMock.verify();
                findDocMock.verify();
            } catch(error) {
                assert.fail();
            }
        });
    });

    describe("getCollection", () => {
        let collectionRequestHandler = null, authSession = null;
        let sandbox = null, couchClient = null;

        beforeEach("getCollection", () => {
            authSession = "auth session";
            collectionRequestHandler = new CollectionRequestHandler();
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient("access token");
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
        });

        afterEach("getCollection", () => {
            sandbox.restore();
        });
        it("should get all collections", async () => {
            let selector = {
                "selector": {
                    "docType": {
                        "$eq": "collection"
                    }
                }
            };
            let response = { "docs": ["id1", "id2", "id3"] };
            sandbox.mock(couchClient).expects("findDocuments")
                .withExactArgs(selector).returns(Promise.resolve(response));
            try {
                let collections = await collectionRequestHandler.getCollection(authSession);
                assert.strictEqual(collections, response);
            } catch(error) {
                assert.fail(error);
            }
        });
    });

    describe("createCollection", () => {
        let sandbox = null, couchClient = null, collectionRequestHandler = null;
        beforeEach("createCollection", () => {
            collectionRequestHandler = new CollectionRequestHandler();
            couchClient = new CouchClient("auth session");
            sandbox = sinon.sandbox.create();
        });

        afterEach("createCollection", () => {
            sandbox.restore();
        });

        it("should create collectionFeed doc when there is docId and collectionId", async () => {
            let docId = "doc id";
            let collectionName = "collection name";
            let collectionId = 123;
            let collectionFeedId = "doc id123";
            let collectionFeedDoc = {
                "docType": "collectionFeed",
                "feedId": docId,
                "collection": collectionName };

            let saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(collectionFeedId, collectionFeedDoc)
                .returns(Promise.resolve({ "ok": true }));

            try {
                let response = await collectionRequestHandler.createCollection(couchClient, docId, collectionName, collectionId);
                assert.deepEqual(response, { "ok": true });
                saveDocMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should create collectionDoc and collectionFeedDoc when there is docId and no collection Id", async () => {
            let docId = "doc id";
            let collectionName = "collection name";
            let updateDocResponse = { "id": "docId" };
            let collectionDoc = {
                "docType": "collection",
                "collection": collectionName };
            let collectionFeedDoc = {
                "docType": "collectionFeed",
                "feedId": docId,
                "collection": collectionName };
            let feedCollectionId = "doc iddocId";

            let updateDocMock = sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(collectionDoc)
                .returns(Promise.resolve(updateDocResponse));
            let saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(feedCollectionId, collectionFeedDoc);

            try {
                let response = await collectionRequestHandler.createCollection(couchClient, docId, collectionName, 0); //eslint-disable-line no-magic-numbers
                assert.deepEqual(response, { "ok": true });
                updateDocMock.verify();
                saveDocMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should create collectionDoc when there is no docId and collectionId", async () => {
            let collectionName = "collection name";
            let collectionDoc = {
                "docType": "collection",
                "collection": collectionName };

            let updateDocMock = sandbox.mock(couchClient).expects("updateDocument").withExactArgs(collectionDoc);

            try {
                let response = await collectionRequestHandler.createCollection(couchClient, "", collectionName, 0); //eslint-disable-line no-magic-numbers
                assert.deepEqual(response, { "ok": true });
                updateDocMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });
    });
});
