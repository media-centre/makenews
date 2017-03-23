import {
    getCollectedFeeds,
    getCollectionFeedIds,
    deleteCollection,
    deleteFeedFromCollection
} from "./../../src/collection/CollectionFeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import RouteLogger from "../../src/routes/RouteLogger";
import sinon from "sinon";
import { assert } from "chai";

describe("CollectionFeedsRequestHandler", () => {

    describe("getCollectedFeeds", () => {
        let sandbox = null, authSession = null, couchClient = null, selector = null;
        let offset = 0, collection = "bzfuwlajfuea_ali2nfaliwean";
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
            const expectedFeeds = [
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
            assert.deepEqual(docs, expectedFeeds);
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

        it("should get collection feeds from db if the collection feed contains selected text", async () => {
            const selectedTextIntermediateDoc = {
                "_id": "id",
                "docType": "collectionFeed",
                "collectionId": collection,
                "title": "title",
                "description": "description",
                "selectText": true
            };
            const collectionFeeds = {
                "docs": [
                    selectedTextIntermediateDoc,
                    {
                        "_id": "id",
                        "docType": "collectionFeed",
                        "collectionId": collection,
                        "feedId": "feedId"
                    }
                ]
            };
            const feedDoc = {
                "title": "title",
                "description": "description",
                "sourceType": "twitter",
                "tags": []
            };
            const expectedDocs = [
                selectedTextIntermediateDoc,
                feedDoc
            ];

            sandbox.mock(couchClient).expects("findDocuments").withExactArgs(selector).returns(Promise.resolve(collectionFeeds));
            sandbox.mock(couchClient).expects("getDocument").withExactArgs("feedId").returns(Promise.resolve(feedDoc));

            const collectedFeeds = await getCollectedFeeds(authSession, collection, offset);

            assert.deepEqual(collectedFeeds, expectedDocs);
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
        let sandbox = null, couchClientInstance = null, routeLogger = null;
        const authSession = "AuthSession";
        const feedId = "FeedId";
        const collectionId = "CollectionId";

        beforeEach("deleteFeedFromCollection", () => {
            sandbox = sinon.sandbox.create();
            couchClientInstance = new CouchClient(authSession);
            routeLogger = RouteLogger.instance();
        });

        afterEach("deleteFeedFromCollection", () => {
            sandbox.restore();
        });

        it("should delete collectionFeedDoc", async() => {
            const collectionFeedDoc = {
                "_id": "1234",
                "collectionId": collectionId,
                "feedId": feedId
            };

            const feedDoc = { "_id": feedId, "title": "title of the feed", "description": "des" };

            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const getMock = sandbox.mock(couchClientInstance).expects("getDocument").twice();
            getMock.onFirstCall().returns(Promise.resolve(feedDoc));
            getMock.onSecondCall().returns(Promise.resolve(collectionFeedDoc));
            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs([collectionFeedDoc]).returns(Promise.resolve({ "ok": true }));

            const loggerMock = sandbox.mock(RouteLogger).expects("instance").returns(routeLogger);
            const debugMock = sandbox.mock(routeLogger).expects("info")
                .withExactArgs("CollectionFeedRequestHandler:: Successfully deleted article from collection");

            const response = await deleteFeedFromCollection(authSession, feedId, collectionId);

            instanceMock.verify();
            getMock.verify();
            deleteMock.verify();
            loggerMock.verify();
            debugMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should delete CollectionFeedDoc and feedDoc if the source is deleted", async() => {
            const collectionFeedDoc = {
                "_id": "1234",
                "feedId": feedId,
                "collectionId": collectionId
            };

            const feedDoc = { "_id": feedId, "title": "title of the feed", "description": "des", "sourceDeleted": true };
            const docsToDelete = [
                collectionFeedDoc,
                feedDoc
            ];
            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const getMock = sandbox.mock(couchClientInstance).expects("getDocument").twice();
            getMock.onFirstCall().returns(Promise.resolve(feedDoc));
            getMock.onSecondCall().returns(Promise.resolve(collectionFeedDoc));

            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs(docsToDelete).returns(Promise.resolve({ "ok": true }));
            const loggerMock = sandbox.mock(RouteLogger).expects("instance").returns(routeLogger);
            const debugMock = sandbox.mock(routeLogger).expects("info")
                .withExactArgs("CollectionFeedRequestHandler:: Successfully deleted article from collection");

            const response = await deleteFeedFromCollection(authSession, feedId, collectionId);

            instanceMock.verify();
            getMock.verify();
            deleteMock.verify();
            loggerMock.verify();
            debugMock.verify();
            assert.deepEqual(response, { "ok": true });
        });

        it("should throw error", async() => {
            const instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const getMock = sandbox.mock(couchClientInstance).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.reject({ "message": "Unexpected response from db" }));
            const loggerMock = sandbox.mock(RouteLogger).expects("instance").returns(routeLogger);
            const debugMock = sandbox.mock(routeLogger).expects("error")
                .withExactArgs(`CollectionFeedRequestHandler:: Failed deleting article from collection with error ${JSON.stringify({ "message": "Unexpected response from db" })}`);
            try {
                await deleteFeedFromCollection(authSession, feedId, collectionId);
                assert.fail();
            } catch (error) {
                instanceMock.verify();
                getMock.verify();
                loggerMock.verify();
                debugMock.verify();
                assert.deepEqual(error, { "message": "Unexpected response from db" });
            }
        });

        it("should delete only intermediate doc if there is selected true", async () => {
            const intermediateDocWithSelectedText = {
                "_id": feedId,
                "docType": "collectionFeed",
                collectionId,
                "title": "title",
                "description": "des of the feed",
                "selectText": true
            };
            sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);
            const feedGetMock = sandbox.mock(couchClientInstance).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.resolve(intermediateDocWithSelectedText));
            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .returns(Promise.resolve({ "ok": true }));
            const response = await deleteFeedFromCollection(authSession, feedId, collectionId);

            feedGetMock.verify();
            deleteMock.verify();

            assert.deepEqual(response, { "ok": true });

        });
    });
});
