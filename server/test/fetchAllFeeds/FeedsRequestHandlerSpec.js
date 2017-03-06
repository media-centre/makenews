import FeedsRequestHandler from "../../src/fetchAllFeeds/FeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import chai, { assert } from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

describe("FeedsRequestHandler", () => {
    describe("fetch feeds", () => {
        let feed = null, authSession = null, feedsRequestHandler = null;
        let couchClientInstanceMock = null;
        let dbName = "dbName", body = null;
        let offset = null, sourceType = "web";
        let sandbox = null;

        beforeEach("fetch feeds", () => {
            feed = [{
                "_id": "A7AE6BD7-0B65-01EF-AE07-DAE4727754E3",
                "docType": "feed",
                "sourceType": "web",
                "url": "http://bala.swecha/",
                "status": "valid"
            }];
            authSession = "Access Token";
            feedsRequestHandler = new FeedsRequestHandler();
            offset = 0;  //eslint-disable-line no-magic-numbers
            body = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "sourceDeleted": {
                        "$or": [
                            {
                                "$exists": false
                            },
                            {
                                "$exists": true,
                                "$eq": false
                            }
                        ]
                    },
                    "pubDate": {
                        "$gt": null
                    }
                },
                "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images", "sourceId"],
                "skip": 0,
                "sort": [{ "pubDate": "desc" }]
            };
            couchClientInstanceMock = new CouchClient(authSession, dbName);
            sandbox = sinon.sandbox.create();
        });

        afterEach("fetch feeds", () => {
            sandbox.restore();
        });

        it("should throw if find documents throw error", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(body).returns(Promise.reject("unexpected response from db"));
            await assert.isRejected(feedsRequestHandler.fetchFeeds(authSession, offset), "unexpected response from db");
        });

        it("should fetch feeds from the db", async () => {
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(body).returns(Promise.resolve(feed));
            let expectedFeeds = await feedsRequestHandler.fetchFeeds(authSession, offset);

            assert.deepEqual(expectedFeeds, feed);
        });


        it("should fetch feeds from the db for an array of filtered sources", async () => {
            var sourceIds = ["A7AE6BD7-0B65-01EF-AE07-DAE4727754E3"];
            let query = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "sourceDeleted": {
                        "$or": [
                            {
                                "$exists": false
                            },
                            {
                                "$exists": true,
                                "$eq": false
                            }
                        ]
                    },
                    "pubDate": {
                        "$gt": null
                    },
                    "$or": [{ "sourceType": {
                        "$eq": sourceType
                    }, "sourceId": {
                        "$in": sourceIds
                    } }]
                },
                "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images", "sourceId"],
                "skip": 0,
                "sort": [{ "pubDate": "desc" }]
            };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(query).returns(Promise.resolve(feed));
            let expectedFeeds = await feedsRequestHandler.fetchFeeds(authSession, offset, { "sources": { "web": sourceIds } });

            assert.deepEqual(expectedFeeds, feed);
        });

        it("should fetch feeds from the db for source type", async () => {
            let query = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "sourceDeleted": {
                        "$or": [
                            {
                                "$exists": false
                            },
                            {
                                "$exists": true,
                                "$eq": false
                            }
                        ]
                    },
                    "pubDate": {
                        "$gt": null
                    },
                    "$or": [{ "sourceType": {
                        "$eq": sourceType
                    } }]
                },
                "fields": ["_id", "title", "description", "link", "sourceType", "bookmark", "tags", "pubDate", "videos", "images", "sourceId"],
                "skip": 0,
                "sort": [{ "pubDate": "desc" }]
            };
            sandbox.mock(CouchClient).expects("instance")
                .withArgs(authSession).returns(couchClientInstanceMock);
            sandbox.mock(couchClientInstanceMock).expects("findDocuments")
                .withArgs(query).returns(Promise.resolve(feed));
            let expectedFeeds = await feedsRequestHandler.fetchFeeds(authSession, offset, { "sources": { "web": [] } });

            assert.deepEqual(expectedFeeds, feed);
        });
    });
});
