import CollectionRequestHandler from "../../src/collection/CollectionRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import * as Constants from "./../../src/util/Constants";
import { isRejected } from "./../helpers/AsyncTestHelper";

describe("CollectionRequestHandler", () => {
    let authSession = null;
    let couchClient = null;
    let collectionRequestHandler = null;
    let sandbox = null;

    beforeEach("CollectionRequestHandler", () => {
        authSession = "auth session";
        couchClient = new CouchClient(authSession);
        collectionRequestHandler = new CollectionRequestHandler(couchClient);
        sandbox = sinon.sandbox.create();
    });

    afterEach("CollectionRequestHandler", () => {
        sandbox.restore();
    });

    describe("updateCollection", () => {
        let docId = null;
        let collectionName = null;
        const sourceId = "http://www.thehindu.com/?service=rss";

        beforeEach("updateCollection", () => {
            docId = "doc id";
            collectionName = "collection name";
        });

        afterEach("updateCollection", () => {
            sandbox.restore();
        });

        it("should throw error if isNewCollection is true and collection id Exist", async() => {
            const collectionDoc = [{ "_id": "collection id", "collection": "first collection" }];
            const findDocMock = sandbox.mock(couchClient).expects("findDocuments")
                .returns(Promise.resolve({ "docs": collectionDoc }));

            const response = await collectionRequestHandler.updateCollection(collectionName, true, docId, "");

            assert.deepEqual(response, { "message": "collection already exists with this name" });
            findDocMock.verify();
        });

        it("should create collectionDoc", async() => {
            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(collectionName).returns(Promise.resolve({ "docs": [] }));
            const createCollectionMock = sandbox.mock(collectionRequestHandler).expects("createCollection")
                .withExactArgs(collectionName).returns(Promise.resolve("1234"));

            const response = await collectionRequestHandler.updateCollection(collectionName, false, "", "");

            getCollectionMock.verify();
            createCollectionMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "1234" });
        });

        it("should create collectionFeedDoc when the collection already exists", async() => {

            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(collectionName).returns(Promise.resolve({ "docs": [{ "_id": "123455" }] }));
            const collectionFeedDocMock = sandbox.mock(collectionRequestHandler).expects("createCollectionFeedDoc")
                .returns(Promise.resolve({ "ok": true }));

            const response = await collectionRequestHandler.updateCollection(collectionName, false, docId, sourceId);

            getCollectionMock.verify();
            collectionFeedDocMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "123455" });
        });

        it("should create collectionDoc and collectionFeedDoc", async() => {
            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(collectionName).returns(Promise.resolve({ "docs": [] }));
            const createCollectionMock = sandbox.mock(collectionRequestHandler).expects("createCollection")
                .withExactArgs(collectionName).returns(Promise.resolve("1234"));
            const collectionFeedDocMock = sandbox.mock(collectionRequestHandler).expects("createCollectionFeedDoc")
                .returns(Promise.resolve({ "ok": true }));

            const response = await collectionRequestHandler.updateCollection(collectionName, false, docId, sourceId);

            getCollectionMock.verify();
            collectionFeedDocMock.verify();
            createCollectionMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "1234" });
        });

        it("should create collection feed doc with the selected Text if it exists", async() => {
            const collectionId = "123455";
            const selectedText = "adding something";
            const getCollectionMock = sandbox.mock(collectionRequestHandler).expects("getCollectionDoc")
                .withExactArgs(collectionName).returns({ "docs": [{ "_id": collectionId }] });
            const docMock = sandbox.mock(collectionRequestHandler).expects("createCollectionFeedWithSelectedText")
                .withExactArgs(collectionId, docId, selectedText);
            const response = await collectionRequestHandler.updateCollection(collectionName, false, docId, sourceId, selectedText);

            getCollectionMock.verify();
            docMock.verify();
            assert.deepEqual(response, { "ok": true, "_id": "123455" });
        });
    });

    describe("createCollection", () =>{

        afterEach("createCollection", () => {
            sandbox.restore();
        });

        it("should return collection id after creating collection", async() => {
            const collectionName = "collection name";
            const collectionDoc = {
                "docType": "collection",
                "collection": collectionName };

            const updateDocMock = sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(collectionDoc).returns(Promise.resolve({ "id": "123" }));

            const response = await collectionRequestHandler.createCollection(collectionName); //eslint-disable-line no-magic-numbers

            updateDocMock.verify();
            assert.deepEqual(response, "123");
        });
    });

    describe("createCollectionFeedDoc", () => {

        afterEach("createCollectionFeedDoc", () => {
            sandbox.restore();
        });

        it("should create collectionFeed doc when there is docId and collectionId", async() => {
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

            const response = await collectionRequestHandler.createCollectionFeedDoc(collectionId, feedId, sourceId);

            saveDocMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should return article already added if the article already added to same collection", async() => {
            const docId = "doc id";
            const sourceId = "1123455";
            const collectionId = "collection id";
            const saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument")
                .returns(Promise.reject({ "status": HttpResponseHandler.codes.CONFLICT, "message": "conflict" }));

            const response = await collectionRequestHandler.createCollectionFeedDoc(collectionId, docId, sourceId);
            assert.deepEqual(response, { "message": "article already added to that collection" });
            saveDocumentMock.verify();
        });

        it("should throw error when there is error from db other than conflict", async() => {
            const docId = "doc id";
            const sourceId = "1233455";
            const collectionId = "collection id";
            const saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument")
                .returns(Promise.reject({ "status": HttpResponseHandler.codes.BAD_REQUEST, "message": "error from db" }));
            try {
                await collectionRequestHandler.createCollectionFeedDoc(collectionId, docId, sourceId);
                assert.fail();
            } catch(error) {
                assert.deepEqual(error, { "status": HttpResponseHandler.codes.BAD_REQUEST, "message": "error from db" });
                saveDocumentMock.verify();
            }
        });
    });

    describe("getAllCollections", () => {
        const collectionsPerReqOriginal = Constants.COLLECTION_PER_REQUEST;

        beforeEach("getAllCollections", () => {
            Constants.COLLECTION_PER_REQUEST = 4; //eslint-disable-line no-magic-numbers
        });

        afterEach("getAllCollections", () => {
            Constants.COLLECTION_PER_REQUEST = collectionsPerReqOriginal;
            sandbox.restore();
        });

        it("should get all collections", async() => {
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

        afterEach("renameCollection", () => {
            sandbox.restore();
        });

        it("should throw an error if the collection is already exits with the same name", async() => {
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

            await isRejected(collectionRequestHandler.renameCollection(collectionId, collectionName),
                `There is already a collection with the name ${collectionName}`);
        });
        
        it("should rename the collection", async() => {
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

            const response = await collectionRequestHandler.renameCollection(collectionId, collectionName);
            
            updateMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should throw error if couchdb throws any error", async() => {
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

            await isRejected(collectionRequestHandler.renameCollection(collectionId, collectionName),
                "unable to rename the collection new collection name");

        });
    });

    describe("createCollectionFeedWithSelectedText", () => {
        const feedId = "feedId";
        const collectionId = "collectionId";
        const selectedText = { "title": "title", "description": "description", "sourceType": "web" };

        afterEach("createCollectionFeedWithSelectedText", () => {
            sandbox.restore();
        });

        it("should create collectionFeed doc with selectedText", async() => {
            const collectionFeedDoc = {
                "docType": "collectionFeed",
                "description": selectedText.description,
                "title": selectedText.title,
                "sourceType": selectedText.sourceType,
                collectionId,
                "selectText": true,
                feedId
            };

            const updateDocMock = sandbox.mock(couchClient).expects("updateDocument")
                .withExactArgs(collectionFeedDoc).returns(Promise.resolve({ "ok": true }));

            await collectionRequestHandler.createCollectionFeedWithSelectedText(collectionId, feedId, selectedText);

            updateDocMock.verify();
        });
    });
});
