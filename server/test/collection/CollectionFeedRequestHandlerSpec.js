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
        let sandbox = null, authSession = null, couchClient = null;
        const offset = 0, collection = "ff49851eb7078d30c9019d0dce00099c";
        const intermediateDocs = {
            "docs": [
                {
                    "_id": "0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5daff49851eb7078d30c9019d0dce00099c",
                    "_rev": "1-637824d000abd687ebccf4c753a33ce2",
                    "docType": "collectionFeed",
                    "feedId": "0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5da",
                    "collectionId": "ff49851eb7078d30c9019d0dce00099c",
                    "sourceId": "http://www.thehindu.com/?service=rss"
                },
                {
                    "_id": "ff49851eb7078d30c9019d0dce002687",
                    "_rev": "1-f265bc8f516e7a6d70e99a22c5976631",
                    "title": "Gayle first to hit 10,000 Twenty20 runs",
                    "tags": [
                        "The Hindu - Home"
                    ],
                    "description": "",
                    "link": "http://www.thehindu.com/sport/cricket/gayle-first-to-hit-10000-twenty20-runs/article18132189.ece?utm_source=RSS_Feed&utm_medium=RSS&utm_campaign=RSS_Syndication",
                    "sourceType": "web",
                    "pubDate": "2017-04-19T05:18:29.000Z",
                    "docType": "collectionFeed",
                    "collectionId": "ff49851eb7078d30c9019d0dce00099c",
                    "selectText": true,
                    "feedId": "c14d7a8585c62b06a20cac6830c9be64e05d78036c6a97ec74ba50540e8d81a7"
                }
            ]
        };
        const feeds = {
            "docs": [
                {
                    "_id": "0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5da",
                    "_rev": "1-532f9595d51afe7ca2bd7cceac662a4a",
                    "guid": "0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5da",
                    "title": "Rupee recoups 8 paise after dollar stumbles",
                    "link": "http://www.thehindu.com/business/markets/rupee-recoups-8-paise-after-dollar-stumbles/article18131850.ece?utm_source=RSS_Feed&utm_medium=RSS&utm_campaign=RSS_Syndication",
                    "description": "The rupee made a mild comeback as it recovered 8 paise to 64.55 against the dollar today after fresh selling of the US currency amid a higher opening in domestic equities.A weak dollar overseas suppor...",
                    "pubDate": "2017-04-19T05:05:00.000Z",
                    "enclosures": [],
                    "docType": "feed",
                    "sourceType": "web",
                    "sourceId": "http://www.thehindu.com/?service=rss",
                    "tags": [
                        "The Hindu - Home"
                    ],
                    "images": []
                },
                {
                    "_id": "ff49851eb7078d30c9019d0dce002687",
                    "_rev": "1-f265bc8f516e7a6d70e99a22c5976631",
                    "title": "Gayle first to hit 10,000 Twenty20 runs",
                    "tags": [
                        "The Hindu - Home"
                    ],
                    "description": "",
                    "link": "http://www.thehindu.com/sport/cricket/gayle-first-to-hit-10000-twenty20-runs/article18132189.ece?utm_source=RSS_Feed&utm_medium=RSS&utm_campaign=RSS_Syndication",
                    "sourceType": "web",
                    "pubDate": "2017-04-19T05:18:29.000Z",
                    "docType": "collectionFeed",
                    "collectionId": "ff49851eb7078d30c9019d0dce00099c",
                    "selectText": true,
                    "feedId": "c14d7a8585c62b06a20cac6830c9be64e05d78036c6a97ec74ba50540e8d81a7"
                }
            ]
        };
        const intermediateDocsQuery = {
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

        beforeEach("getCollectedFeeds", () => {
            sandbox = sinon.sandbox.create();
            authSession = "test_session";
            couchClient = new CouchClient();
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });

        afterEach("getCollectedFeeds", () => {
            sandbox.restore();
        });

        it("should get Collection Feeds from the database", async() => {
            const feedsQuery = {
                "selector": {
                    "_id": {
                        "$in": ["0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5da",
                            "ff49851eb7078d30c9019d0dce002687"]
                    }
                }
            };
            const getDocsMock = sandbox.mock(couchClient);
            const getFirstFeedMock = getDocsMock.expects("findDocuments").withArgs(intermediateDocsQuery).returns(Promise.resolve(intermediateDocs));
            const getSecondFeedMock = getDocsMock.expects("findDocuments").withArgs(feedsQuery).returns(Promise.resolve(feeds));
            let docs = await getCollectedFeeds(authSession, collection, offset);

            assert.deepEqual(docs, feeds.docs);
            getFirstFeedMock.verify();
            getSecondFeedMock.verify();

        });

        it("should reject with error when database throws unexpected response while getting feeds", async() => {
            const feedsQuery = {
                "selector": {
                    "_id": {
                        "$in": ["0237b027db53b23cbc010baa30f103c47e1cf41d3dd253d2f5e70280e68ad5da",
                            "ff49851eb7078d30c9019d0dce002687"]
                    }
                }
            };
            const getDocsMock = sandbox.mock(couchClient);
            const getFirstFeedMock = getDocsMock.expects("findDocuments").withArgs(intermediateDocsQuery).returns(Promise.resolve(intermediateDocs));
            const getSecondFeedMock = getDocsMock.expects("findDocuments").withArgs(feedsQuery).returns(Promise.reject("unexpected response from the db"));
            try {
                await getCollectedFeeds(authSession, collection, offset);
                getFirstFeedMock.verify();
                getSecondFeedMock.verify();
            } catch (error) {
                assert.strictEqual(error, "unexpected response from the db");
            }
        });

        it("should reject with error when database throws unexpected response while getting intermediate docs", async() => {
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(intermediateDocsQuery).returns(Promise.reject("unexpected response from the db"));
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
        let sandbox = null, couchClientInstance = null, instanceMock = null, getMock = null;
        const authSession = "AuthSession";
        const intermediateDocId = "intermediateDocId";
        const feedId = "FeedId";
        const collectionId = "CollectionId";
        const collectionFeedDoc = {
            "_id": "1234",
            "collectionId": collectionId,
            "feedId": feedId
        };
        const feedDoc = {
            "_id": feedId,
            "title": "title of the feed",
            "description": "des",
            "sourceDeleted": true
        };
        const docsToDelete = [
            collectionFeedDoc,
            feedDoc
        ];


        beforeEach("deleteFeedFromCollection", () => {
            sandbox = sinon.sandbox.create();
            couchClientInstance = new CouchClient(authSession);

            instanceMock = sandbox.mock(CouchClient).expects("instance")
                .withExactArgs(authSession).returns(couchClientInstance);

            getMock = sandbox.mock(couchClientInstance).expects("getDocument")
                .withExactArgs(intermediateDocId).returns(Promise.resolve(collectionFeedDoc));
        });

        afterEach("deleteFeedFromCollection", () => {
            sandbox.restore();
        });

        it("should delete collectionFeedDoc when there is no feedId", async() => {

            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs([collectionFeedDoc]).returns(Promise.resolve());

            const response = await deleteFeedFromCollection(authSession, intermediateDocId);

            instanceMock.verify();
            getMock.verify();
            deleteMock.verify();
            assert.deepEqual(response, { "ok": true, "deleteFeed": feedId });
        });

        it("should delete CollectionFeedDoc and feedDoc if the source is deleted when the feed is part of only this collection", async() => {

            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns(Promise.resolve({ "docs": docsToDelete }));

            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs(docsToDelete).returns(Promise.resolve());

            const response = await deleteFeedFromCollection(authSession, intermediateDocId, feedId);

            instanceMock.verify();
            getMock.verify();
            deleteMock.verify();
            findMock.verify();

            assert.deepEqual(response, { "ok": true, "deleteFeed": feedId });
        });

        it("should delete CollectionFeedDoc and feedDoc if the source is deleted when the feed is part of only this collection", async() => {
            docsToDelete.push({ "_id": "feedId2collectionId2", "collectionId": "collectionId2", "feedId": "feedId2", "sourceId": "source" });

            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns(Promise.resolve({ "docs": docsToDelete }));

            const deleteMock = sandbox.mock(couchClientInstance).expects("deleteBulkDocuments")
                .withExactArgs([collectionFeedDoc]).returns(Promise.resolve());

            const response = await deleteFeedFromCollection(authSession, intermediateDocId, feedId);

            instanceMock.verify();
            getMock.verify();
            deleteMock.verify();
            findMock.verify();

            assert.deepEqual(response, { "ok": true, "deleteFeed": feedId });
        });

        it("should throw error", async() => {
            const findMock = sandbox.mock(couchClientInstance).expects("findDocuments")
                .returns(Promise.reject());

            try {
                await deleteFeedFromCollection(authSession, intermediateDocId, feedId);
                assert.fail();
            } catch (error) {
                instanceMock.verify();
                getMock.verify();
                findMock.verify();
                assert.deepEqual(error, { "message": "Unexpected response from db" });
            }
        });
    });
});
