import CollectionRequestHandler from "../../src/collection/CollectionRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("CollectionRequestHandler", () => {
    let collectionRequestHandler = null, authSession = null, docId = null, collectionName = null;
    let sandbox = null, couchClient = null;
    beforeEach("CollectionRequestHandler", () => {
        authSession = "auth session";
        docId = "doc id";
        collectionName = "collection name";
        collectionRequestHandler = new CollectionRequestHandler();
        sandbox = sinon.sandbox.create();
        couchClient = new CouchClient("access token");
        sandbox.mock(CouchClient).expects("instance").returns(couchClient);
    });

    afterEach("CollectionRequestHandler", () => {
        sandbox.restore();
    });

    it("should create new collection when there is no docId", async () => {
        let docObj = { "docType": "collection", "feeds": [] };
        let saveDocMock = sandbox.mock(couchClient).expects("saveDocument").withExactArgs(collectionName, docObj);
        saveDocMock.returns(Promise.resolve({ "ok": true }));

        try {
            let response = await collectionRequestHandler.updateCollection(authSession, undefined, collectionName); //eslint-disable-line no-undefined
            assert.deepEqual(response, { "ok": true });
            saveDocMock.verify();
        } catch (error) {
            assert.fail(error);
        }
    });

    it("should create collection if doesn't exist and add feed id to the doc", async () => {
        let docObj = { "docType": "collection", "feeds": [docId] };
        let getDocMock = sandbox.mock(couchClient).expects("getDocument")
            .withExactArgs(collectionName)
            .returns(Promise.resolve({ "error": "missing" }));
        let saveDocMock = sandbox.mock(couchClient).expects("saveDocument").withExactArgs(collectionName, docObj);
        saveDocMock.returns(Promise.resolve({ "ok": true }));

        try {
            let response = await collectionRequestHandler.updateCollection(authSession, docId, collectionName); //eslint-disable-line no-undefined
            assert.deepEqual(response, { "ok": true });
            saveDocMock.verify();
            getDocMock.verify();
        } catch (error) {
            assert.fail(error);
        }
    });

    it("should add feed id to the doc if collection exist", async () => {
        let docObj = { "docType": "collection", "feeds": [docId, "one more id"] };
        let getDocMock = sandbox.mock(couchClient).expects("getDocument")
            .withExactArgs(collectionName)
            .returns(Promise.resolve({ "docType": "collection", "feeds": [docId] }));
        let saveDocMock = sandbox.mock(couchClient).expects("saveDocument").withExactArgs(collectionName, docObj);
        saveDocMock.returns(Promise.resolve({ "ok": true }));

        try {
            let response = await collectionRequestHandler.updateCollection(authSession, "one more id", collectionName);
            assert.deepEqual(response, { "ok": true });
            saveDocMock.verify();
            getDocMock.verify();
        } catch (error) {
            assert.fail(error);
        }
    });
});
