import CollectionRequestHandler from "../../src/collection/CollectionRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import * as Constants from "./../../src/util/Constants";
import { isRejected } from "./../helpers/AsyncTestHelper";

describe("CollectionRequestHandler", () => {
    describe("updateCollection", () => {
        let collectionRequestHandler = null, authSession = null, docId = null, collectionName = null;
        let sandbox = null, couchClient = null, sourceId = "http://www.thehindu.com/?service=rss";
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
            const collectionDoc = [{ "_id": "collection id", "collection": "first collection" }];
            const findDocMock = sandbox.mock(couchClient).expects("findDocuments")
                .returns(Promise.resolve({ "docs": collectionDoc }));

            const response = await collectionRequestHandler.updateCollection(authSession, collectionName, true, docId, "");
            assert.deepEqual(response, { "message": "collection already exists with this name" });
            findDocMock.verify();
        });

        it("should create collectionDoc", async () => {
            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(couchClient, collectionName).returns(Promise.resolve({ "docs": [] }));
            const createCollectionMock = sandbox.mock(collectionRequestHandler).expects("createCollection")
                .withExactArgs(couchClient, collectionName).returns(Promise.resolve("1234"));

            const response = await collectionRequestHandler.updateCollection(authSession, collectionName, false, "", "");

            getCollectionMock.verify();
            createCollectionMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "1234" });
        });

        it("should create collectionFeedDoc when the collection already exists", async () => {

            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(couchClient, collectionName).returns(Promise.resolve({ "docs": [{ "_id": "123455" }] }));
            const collectionFeedDocMock = sandbox.mock(collectionRequestHandler).expects("createCollectionFeedDoc")
                .returns(Promise.resolve({ "ok": true }));

            const response = await collectionRequestHandler.updateCollection(authSession, collectionName, false, docId, sourceId);

            getCollectionMock.verify();
            collectionFeedDocMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "123455" });
        });

        it("should create collectionDoc and collectionFeedDoc", async () => {
            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(couchClient, collectionName).returns(Promise.resolve({ "docs": [] }));
            const createCollectionMock = sandbox.mock(collectionRequestHandler).expects("createCollection")
                .withExactArgs(couchClient, collectionName).returns(Promise.resolve("1234"));
            const collectionFeedDocMock = sandbox.mock(collectionRequestHandler).expects("createCollectionFeedDoc")
                .returns(Promise.resolve({ "ok": true }));

            const response = await collectionRequestHandler.updateCollection(authSession, collectionName, false, docId, sourceId);

            getCollectionMock.verify();
            collectionFeedDocMock.verify();
            createCollectionMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "1234" });
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

        it("should return collection id after creating collection", async () => {
            const collectionName = "collection name";
            const collectionDoc = {
                "docType": "collection",
                "collection": collectionName };

            const updateDocMock = sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(collectionDoc).returns(Promise.resolve({ "id": "123" }));

            const response = await collectionRequestHandler.createCollection(couchClient, collectionName); //eslint-disable-line no-magic-numbers
            assert.deepEqual(response, "123");
            updateDocMock.verify();
        });
    });

    describe("createCollectionFeedDoc", () => {
        let sandbox = null, couchClient = null, collectionRequestHandler = null;
        beforeEach("createCollectionFeedDoc", () => {
            collectionRequestHandler = new CollectionRequestHandler();
            couchClient = new CouchClient("auth session");
            sandbox = sinon.sandbox.create();
        });

        afterEach("createCollectionFeedDoc", () => {
            sandbox.restore();
        });

        it("should create collectionFeed doc when there is docId and collectionId", async () => {
            const feedId = "doc id";
            const sourceId = "http://www.thehindu.com/?service=rss";
            const collectionId = 123;
            const collectionFeedId = "doc id123";
            const collectionFeedDoc = {
                "docType": "collectionFeed",
                feedId,
                collectionId,
                sourceId
            };

            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(collectionFeedId, collectionFeedDoc)
                .returns(Promise.resolve({ "ok": true }));

            const response = await collectionRequestHandler.createCollectionFeedDoc(couchClient, collectionId, feedId, sourceId);
            assert.deepEqual(response, { "ok": true });
            saveDocMock.verify();
        });

        it("should return article already added if the article already added to same collection", async () => {
            const docId = "doc id";
            const sourceId = "1123455";
            const collectionId = "collection id";
            const saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument")
                .returns(Promise.reject({ "status": HttpResponseHandler.codes.CONFLICT, "message": "conflict" }));

            const response = await collectionRequestHandler.createCollectionFeedDoc(couchClient, collectionId, docId, sourceId);
            assert.deepEqual(response, { "message": "article already added to that collection" });
            saveDocumentMock.verify();
        });

        it("should throw error when there is error from db other than conflict", async () => {
            const docId = "doc id";
            const sourceId = "1233455";
            const collectionId = "collection id";
            const saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument")
                .returns(Promise.reject({ "status": HttpResponseHandler.codes.BAD_REQUEST, "message": "error from db" }));
            try {
                await collectionRequestHandler.createCollectionFeedDoc(couchClient, collectionId, docId, sourceId);
                assert.fail();
            } catch(error) {
                assert.deepEqual(error, { "status": HttpResponseHandler.codes.BAD_REQUEST, "message": "error from db" });
                saveDocumentMock.verify();
            }
        });
    });

    describe("getAllCollections", () => {
        let collectionRequestHandler = null, authSession = null;
        let sandbox = null, couchClient = null;
        const collectionsPerReqOriginal = Constants.COLLECTION_PER_REQUEST;

        beforeEach("getAllCollections", () => {
            authSession = "auth session";
            collectionRequestHandler = new CollectionRequestHandler();
            sandbox = sinon.sandbox.create();
            couchClient = new CouchClient("access token");
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            Constants.COLLECTION_PER_REQUEST = 4; //eslint-disable-line no-magic-numbers
        });

        afterEach("getAllCollections", () => {
            Constants.COLLECTION_PER_REQUEST = collectionsPerReqOriginal;
            sandbox.restore();
        });
        it("should get all collections", async () => {
            const allCollections = { "docs": ["id1", "id2", "id3", "id4", "id5", "id6"] };
            const firstResponse = { "docs": ["id1", "id2", "id3", "id4"] };
            const secondResponse = { "docs": ["id5", "id6"] };

            const finDocsMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            finDocsMock.onFirstCall().returns(Promise.resolve(firstResponse))
                .onSecondCall().returns(Promise.resolve(secondResponse));

            const collections = await collectionRequestHandler.getAllCollections(authSession);
            assert.deepEqual(collections, allCollections);
        });
    });
    
    describe("renameCollection", () => {
        const sandbox = sinon.sandbox.create();
        const collectionReqHandler = CollectionRequestHandler.instance();
        let couchClient = null;
        const authSession = "authSession";
        
        beforeEach("renameCollection", () => {
            couchClient = new CouchClient(authSession);
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("renameCollection", () => {
            sandbox.restore();
        });

        it("should throw an error if the collection is already exits with the same name", async () => {
            const collectionId = 123456;
            const collectionName = "new collection name";
            const selector = {
                "selector": {
                    "docType": {
                        "$eq": "collection"
                    },
                    "collection": {
                        "$eq": collectionName
                    }
                }
            };
            sandbox.mock(couchClient).expects("findDocuments").withExactArgs(selector)
                .returns({ "docs": [{ "_id": 1231 }] });

            await isRejected(collectionReqHandler.renameCollection(authSession, collectionId, collectionName),
                `There is already a collection with the name ${collectionName}`);
        });
        
        it("should rename the collection", async () => {
            const collectionId = 123456;
            const collectionName = "new collection name";
            sandbox.stub(couchClient, "findDocuments").returns(Promise.resolve({ "docs": [] }));
            
            sandbox.stub(couchClient, "getDocument").returns(Promise.resolve({
                "_id": collectionId,
                "docType": "collection",
                "collection": "collection name"
            }));
            
            const updatedCollection = {
                "_id": collectionId,
                "docType": "collection",
                "collection": collectionName
            };
            
            const updateMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(collectionId, updatedCollection).returns(Promise.resolve({ "ok": true }));

            const response = await collectionReqHandler.renameCollection(authSession, collectionId, collectionName);
            
            updateMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should throw error if couchdb throws any error", async () => {
            const collectionId = 123456;
            const collectionName = "new collection name";
            sandbox.stub(couchClient, "findDocuments").returns(Promise.resolve({ "docs": [] }));

            sandbox.stub(couchClient, "getDocument").returns(Promise.resolve({
                "_id": collectionId,
                "docType": "collection",
                "collection": "collection name"
            }));

            const updatedCollection = {
                "_id": collectionId,
                "docType": "collection",
                "collection": collectionName
            };

            sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(collectionId, updatedCollection).returns(Promise.reject({}));

            await isRejected(collectionReqHandler.renameCollection(authSession, collectionId, collectionName),
                "unable to rename the collection new collection name");
        });
    });
});
