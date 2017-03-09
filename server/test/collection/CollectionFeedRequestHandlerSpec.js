import {
    getCollectedFeeds,
    getCollectionFeedIds,
    deleteCollection,
    deleteFeedFromCollection
} from "./../../src/collection/CollectionFeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("CollectionFeedsRequestHandler", () => {

    describe("getCollectedFeeds", () => {
        let sandbox = null, authSession = null, couchClient = null, selector = null;
        let offset = 0, collection = "bzfuwlajfuea_ali2nfaliwean";

        beforeEach("getCollectedFeeds", () => {
            sandbox = sinon.sandbox.create();
            selector = {
                "selector": {
                    "docType": {
                        "$eq": "collectionFeed"
                    },
                    "collectionId": {
                        "$eq": collection
                    }
                },
                "skip": offset
            };
            authSession = "test_session";
            couchClient = new CouchClient();
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("getCollectedFeeds", () => {
            sandbox.restore();
        });

        it("should get Collection Feeds from the database", async() => {
            const feedIDs = {
                "docs": [
                    {
                        "_id": "id",
                        "docType": "collectionFeed",
                        "feedId": "feedId",
                        "collectionId": collection
                    },
                    {
                        "_id": "id2",
                        "docType": "collectionFeed",
                        "feedId": "feedId2",
                        "collectionId": collection
                    }
                ]
            };
            const feeds = [
                {
                    "_id": "id",
                    "title": "title",
                    "description": "description"
                },
                {
                    "_id": "id2",
                    "title": "title2",
                    "description": "description2"
                }
            ];

            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withExactArgs(selector).returns(Promise.resolve(feedIDs));

            let getDocsMock = sandbox.mock(couchClient);

            let getFirstFeedMock = getDocsMock.expects("getDocument").withArgs("feedId").returns(Promise.resolve({
                "_id": "id",
                "title": "title",
                "description": "description"
            }));

            let getSecondFeedMock = getDocsMock.expects("getDocument").withArgs("feedId2").returns(Promise.resolve({
                "_id": "id2",
                "title": "title2",
                "description": "description2"
            }));

            let docs = await getCollectedFeeds(authSession, collection, offset);
            assert.deepEqual(docs, feeds);
            findDocumentsMock.verify();
            getFirstFeedMock.verify();
            getSecondFeedMock.verify();
        });

        it("should get Collection Feeds from the database when one of the promise is rejected", async() => {
            const feedIDs = {
                "docs": [
                    {
                        "_id": "id",
                        "docType": "collectionFeed",
                        "feedId": "feedId",
                        "collection": collection
                    },
                    {
                        "_id": "id2",
                        "docType": "collectionFeed",
                        "feedId": "feedId2",
                        "collection": collection
                    }
                ]
            };

            const feeds = [
                {
                    "_id": "id",
                    "title": "title",
                    "description": "description"
                }
            ];

            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.resolve(feedIDs));

            let getDocsMock = sandbox.mock(couchClient);

            const getFirstFeedMock = getDocsMock.expects("getDocument").withArgs("feedId").returns(Promise.resolve({
                "_id": "id",
                "title": "title",
                "description": "description"
            }));

            const getSecondFeedMock = getDocsMock.expects("getDocument").withArgs("feedId2").returns(Promise.reject({
                "_id": "id2",
                "title": "title2",
                "description": "description2"
            }));

            const docs = await getCollectedFeeds(authSession, collection, offset);

            findDocumentsMock.verify();
            getFirstFeedMock.verify();
            getSecondFeedMock.verify();
            assert.deepEqual(docs, feeds);
        });

        it("should reject with error when database throws unexpected response while getting feedIds", async() => {
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.reject("unexpected response from the db"));
            try {
                await getCollectedFeeds(authSession, collection, offset);
                findDocumentsMock.verify();
            } catch (error) {
                assert.strictEqual(error, "unexpected response from the db");
            }
        });
    });

    describe("getCollectionFeedIds", () => {
        const sandbox = sinon.sandbox.create();
        const sourceIds = ["14251256"];

        afterEach("getCollectionFeedIds", () => {
            sandbox.restore();
        });

        it("should return array with feed ids", async() => {
            const couchClient = CouchClient.instance("accessToken");
            const collectionFeedDocs = { "docs": [{ "feedId": "feedId1" }, { "feedId": "feedId2" }] };
            const expectedFeedIdArray = ["feedId1", "feedId2"];
            const selector = {
                "selector": {
                    "docType": {
                        "$eq": "collectionFeed"
                    },
                    "sourceId": {
                        "$in": sourceIds
                    }
                },
                "fields": ["feedId"],
                "skip": 0,
                "limit": 1000
            };
            const findDocsMock = sandbox.mock(couchClient).expects("findDocuments")
                .withExactArgs(selector).returns(Promise.resolve(collectionFeedDocs));

            const feedIdArray = await getCollectionFeedIds(couchClient, sourceIds); //eslint-disable-line no-magic-numbers

            findDocsMock.verify();
            assert.deepEqual(feedIdArray, expectedFeedIdArray);
        });

        it("should return empty array", async() => {
            const couchClient = CouchClient.instance("accessToken");
            const colletionFeedDocs = { "docs": [] };
            const expectedFeedIdArray = [];
            sandbox.mock(couchClient).expects("findDocuments").returns(Promise.resolve(colletionFeedDocs));

            const feedIdArray = await getCollectionFeedIds(couchClient); //eslint-disable-line no-magic-numbers
            assert.deepEqual(feedIdArray, expectedFeedIdArray);
        });
    });

    describe("deleteCollections", () => {
        const sandbox = sinon.sandbox.create();
        const authSession = "accessToken";
        let couchClient = null;
        const collectionId = "sdfuenxyw13s_12qadj";
        beforeEach("deleteCollections", () => {
            couchClient = new CouchClient(authSession);
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("deleteCollections", () => {
            sandbox.restore();
        });

        it("should call couchDb for the collection Document", async() => {
            sandbox.stub(couchClient, "findDocuments").returns(Promise.resolve({ "docs": [] }));
            sandbox.stub(couchClient, "deleteBulkDocuments").returns(Promise.resolve());

            const collectionDocMock = sandbox.mock(couchClient);
            collectionDocMock.expects("getDocument").withExactArgs(collectionId).returns({});

            await deleteCollection(authSession, collectionId);

            collectionDocMock.verify();
        });

        it("should delete docs", async() => {
            const interMediateResults = { "docs": [{ "feedId": "id1" }, { "feedId": "id4" }, { "feedId": "id2" }] };
            const feedDocs = {
                "docs": [
                    { "_id": "id1", "sourceDeleted": true },
                    { "_id": "id2", "sourceDeleted": true }]
            };
            const collectionDoc = { "_id": collectionId, "collection": "name" };
            const deleteDocs = [
                { "feedId": "id1" },
                { "feedId": "id4" },
                { "feedId": "id2" },
                { "_id": "sdfuenxyw13s_12qadj", "collection": "name" },
                { "_id": "id1", "sourceDeleted": true },
                { "_id": "id2", "sourceDeleted": true }
            ];

            const findDocsMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findDocsMock.onFirstCall().returns(Promise.resolve(interMediateResults));
            findDocsMock.onSecondCall().returns(Promise.resolve(feedDocs));

            sandbox.stub(couchClient, "getDocument").returns(Promise.resolve(collectionDoc));

            const saveMock = sandbox.mock(couchClient).expects("deleteBulkDocuments");
            saveMock.withExactArgs(deleteDocs).returns(Promise.resolve({ "ok": true }));

            let response = await deleteCollection(authSession, collectionId);

            findDocsMock.verify();
            saveMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });

    describe("deleteFeedFromCollection", () => {
        let sandbox = null;
        const authSession = "AuthSession";
        const feedId = "FeedId";
        const collectionId = "CollectionId";
        let query = null, couchClientInstance = null;
        beforeEach("deleteFeedFromCollection", () => {
            sandbox = sinon.sandbox.create();
            query = {
                "selector": {
                    "collectionId": {
                        "$eq": collectionId
                    },
                    "feedId": {
                        "$eq": feedId
                    }
                }
            };
            couchClientInstance = new CouchClient(authSession);
        });

        afterEach("deleteFeedFromCollection", () => {
            sandbox.restore();
        });

        it("should delete collectionFeedDoc", async() => {
            const collectionFeedDoc = {
                "docs": [{
                    "_id": "1234",
                    "feedId": feedId,
                    "collectionId": collectionId
                }]
            };

            const feedDoc = { "_id": feedId, "title": "title of the feed", "description": "des" };

            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .withExactArgs(query).returns(Promise.resolve(collectionFeedDoc));
            const getDocumentMock = sandbox.mock(couchClientInstance).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.resolve(feedDoc));
            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs(collectionFeedDoc.docs).returns(Promise.resolve({ "ok": true }));

            const response = await deleteFeedFromCollection(authSession, feedId, collectionId);

            instanceMock.verify();
            findMock.verify();
            getDocumentMock.verify();
            deleteMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should delete CollectionFeedDoc and feedDoc if the source is deleted", async() => {
            const collectionFeedDoc = {
                "docs": [{
                    "_id": "1234",
                    "feedId": feedId,
                    "collectionId": collectionId
                }]
            };

            const feedDoc = { "_id": feedId, "title": "title of the feed", "description": "des", "sourceDeleted": true };
            const docsToDelete = [...(collectionFeedDoc.docs), feedDoc];

            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .withExactArgs(query).returns(Promise.resolve(collectionFeedDoc));
            const getDocumentMock = sandbox.mock(couchClientInstance).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.resolve(feedDoc));
            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs(docsToDelete).returns(Promise.resolve({ "ok": true }));

            const response = await deleteFeedFromCollection(authSession, feedId, collectionId);

            instanceMock.verify();
            findMock.verify();
            getDocumentMock.verify();
            deleteMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should throw error", async() => {
            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .withExactArgs(query).returns(Promise.reject({ "message": "Unexpected response from db" }));

            try {
                await deleteFeedFromCollection(authSession, feedId, collectionId);
                assert.fail();
            } catch (error) {
                instanceMock.verify();
                findMock.verify();
                assert.deepEqual(error, { "message": "Unexpected response from db" });
            }
        });
    });

    describe("deleteCollections", () => {
        const sandbox = sinon.sandbox.create();
        const authSession = "accessToken";
        let couchClient = null;
        const collectionId = "sdfuenxyw13s_12qadj";
        beforeEach("deleteCollections", () => {
            couchClient = new CouchClient(authSession);
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("deleteCollections", () => {
            sandbox.restore();
        });

        it("should call couchDb for the collection Document", async () => {
            sandbox.stub(couchClient, "findDocuments").returns(Promise.resolve({ "docs": [] }));
            sandbox.stub(couchClient, "deleteBulkDocuments").returns(Promise.resolve());

            const collectionDocMock = sandbox.mock(couchClient);
            collectionDocMock.expects("getDocument").withExactArgs(collectionId).returns({});

            await deleteCollection(authSession, collectionId);

            collectionDocMock.verify();
        });

        it("should delete docs", async () => {
            const interMediateResults = { "docs": [{ "feedId": "id1" }, { "feedId": "id4" }, { "feedId": "id2" }] };
            const feedDocs = { "docs": [
                { "_id": "id1", "sourceDeleted": true },
                { "_id": "id2", "sourceDeleted": true }]
            };
            const collectionDoc = { "_id": collectionId, "collection": "name" };
            const deleteDocs = [
                { "feedId": "id1" },
                { "feedId": "id4" },
                { "feedId": "id2" },
                { "_id": "sdfuenxyw13s_12qadj", "collection": "name" },
                { "_id": "id1", "sourceDeleted": true },
                { "_id": "id2", "sourceDeleted": true }
            ];

            const findDocsMock = sandbox.mock(couchClient).expects("findDocuments").twice();
            findDocsMock.onFirstCall().returns(Promise.resolve(interMediateResults));
            findDocsMock.onSecondCall().returns(Promise.resolve(feedDocs));

            sandbox.stub(couchClient, "getDocument").returns(Promise.resolve(collectionDoc));

            const saveMock = sandbox.mock(couchClient).expects("deleteBulkDocuments");
            saveMock.withExactArgs(deleteDocs).returns(Promise.resolve({ "ok": true }));

            let response = await deleteCollection(authSession, collectionId);

            findDocsMock.verify();
            saveMock.verify();
            assert.deepEqual(response, { "ok": true });
        });
    });
});
