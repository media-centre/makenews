import FeedsRequestHandler from "../../src/fetchAllFeeds/FeedsRequestHandler";
import CouchClient from "../../src/CouchClient";
import * as LuceneClient from "../../src/LuceneClient";
import { userDetails } from "./../../src/Factory";
import chai, { assert } from "chai";
import sinon from "sinon";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import R from "ramda"; //eslint-disable-line id-length

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
                    "$or": [{
                        "sourceType": {
                            "$eq": sourceType
                        }, "sourceId": {
                            "$in": sourceIds
                        }
                    }]
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
                    "$or": [{
                        "sourceType": {
                            "$eq": sourceType
                        }
                    }]
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

    describe("searchFeeds", () => {
        let sandbox = null;
        let feedRequestHandler = null;
        const authSession = "AuthSession", dbName = "dbName";
        let sourceType = "web", searchKey = "test", skip = 5;
        let response = {
            "q": "+sourceType:web +title:test* description:test*",
            "fetch_duration": 0,
            "total_rows": 14,
            "limit": 25,
            "search_duration": 0,
            "etag": "1358a6ef5569e8",
            "skip": 0,
            "rows": [{
                "score": 0.03390154987573624,
                "id": "2e8e560b4bce1793c7fab1889d78ac7ff60d8cefcb92dcb808775b5d04b26ad9",
                "doc": {
                    "sourceType": "web",
                    "description": "President Donald Trump signed an executive order Tuesday aimed at signaling his commitment to historically black colleges",
                    "title": "Trump signs executive order on black colleges"
                }
            }, {
                "score": 0.03390154987573624,
                "id": "3e02fd2f7e49dc4107b505378e457c60135e4c96b4477f6b02c14a30fd4b80fd",
                "doc": {
                    "sourceType": "web",
                    "description": "US President Donald Trump\u2019s top spymaster nominee has said he was \u201cshocked\u201d to read that India successfully launched",
                    "title": "Trump\u2019s spy pick \u2018shocked\u2019 by India launching 104 satellites"
                }
            }]
        };
        beforeEach("searchFeeds", () => {
            sandbox = sinon.sandbox.create();
            feedRequestHandler = FeedsRequestHandler.instance();
        });

        afterEach("searchFeeds", () => {
            sandbox.restore();
        });

        it("should call searchDocuments with query on title, description and sourceType if the sourceType is web ", async () => {
            const docs = R.map(row => row.doc)(response.rows);
            const expectedResult = { "docs": docs, "paging": { "offset": 30 } };
            const query = {
                "q": `sourceType:${sourceType} AND title:${searchKey}* OR description:${searchKey}*`,
                "sort": "\\pubDate<date>",
                "limit": 25,
                skip,
                "include_docs": true
            };
            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").withArgs(dbName, "_design/feedSearch/by_document", query).returns(Promise.resolve(response));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it("should call searchDocuments with query on only title, description if the sourceType is trending ", async () => {
            const docs = R.map(row => row.doc)(response.rows);
            sourceType = "trending";
            const expectedResult = { "docs": docs, "paging": { "offset": 30 } };
            const query = {
                "q": `title:${searchKey}* OR description:${searchKey}*`,
                "sort": "\\pubDate<date>",
                "limit": 25,
                skip,
                "include_docs": true
            };
            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").withArgs(dbName, "_design/feedSearch/by_document", query).returns(Promise.resolve(response));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it("should call searchDocuments with query on only title, description with bookmark if the sourceType is bookmark ", async () => {
            const docs = R.map(row => row.doc)(response.rows);
            sourceType = "bookmark";
            const expectedResult = { "docs": docs, "paging": { "offset": 30 } };
            const query = {
                "q": `bookmark:true AND title:${searchKey}* OR description:${searchKey}*`,
                "sort": "\\pubDate<date>",
                "limit": 25,
                skip,
                "include_docs": true
            };
            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").withArgs(dbName, "_design/feedSearch/by_document", query).returns(Promise.resolve(response));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it("should return the feeds related to search key", async () => {

            const docs = R.map(row => row.doc)(response.rows);
            const expectedResult = { "docs": docs, "paging": { "offset": 30 } };

            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").returns(Promise.resolve(response));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it("should not return the feeds when sourceDeleted is true", async() => {
            sourceType = "web";
            const response1 = {
                "q": "+sourceType:web +title:test* description:test*",
                "fetch_duration": 0,
                "total_rows": 14,
                "limit": 25,
                "search_duration": 0,
                "etag": "1358a6ef5569e8",
                "skip": 0,
                "rows": [{
                    "score": 0.03390154987573624,
                    "id": "2e8e560b4bce1793c7fab1889d78ac7ff60d8cefcb92dcb808775b5d04b26ad9",
                    "doc": {
                        "sourceType": "web",
                        "description": "President Donald Trump signed an executive order Tuesday aimed at signaling his commitment to historically black colleges",
                        "title": "Trump signs executive order on black colleges",
                        "sourceDeleted": true
                    }
                }]
            };

            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").returns(Promise.resolve(response1));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result.docs, []);
        });

        it("should return the feeds when source type is bookmark and sourceDeleted is true", async() => {
            response = {
                "q": "+sourceType:web +title:test* description:test*",
                "fetch_duration": 0,
                "total_rows": 14,
                "limit": 25,
                "search_duration": 0,
                "etag": "1358a6ef5569e8",
                "skip": 0,
                "rows": [{
                    "score": 0.03390154987573624,
                    "id": "2e8e560b4bce1793c7fab1889d78ac7ff60d8cefcb92dcb808775b5d04b26ad9",
                    "doc": {
                        "description": "President Donald Trump signed an executive order Tuesday aimed at signaling his commitment to historically black colleges",
                        "title": "Trump signs executive order on black colleges",
                        "sourceDeleted": true
                    }
                }]
            };
            sourceType = "bookmark";
            const docs = [{
                "description": "President Donald Trump signed an executive order Tuesday aimed at signaling his commitment to historically black colleges",
                "title": "Trump signs executive order on black colleges",
                "sourceDeleted": true
            }];
            const expectedResult = { "docs": docs, "paging": { "offset": 30 } };

            sandbox.stub(userDetails, "getUser").returns({ dbName });
            const searchDocumentMock = sandbox.mock(LuceneClient)
                .expects("searchDocuments").returns(Promise.resolve(response));

            const result = await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);

            searchDocumentMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it("should reject with error if search documents reject with error", async () => {
            let searchDocumentMock = null;
            try {
                sandbox.stub(userDetails, "getUser").returns({ dbName });
                searchDocumentMock = sandbox.mock(LuceneClient).expects("searchDocuments").returns(Promise.reject("error"));

                await feedRequestHandler.searchFeeds(authSession, sourceType, searchKey, skip);
            } catch(error) {
                assert.strictEqual(`No Search results found for this keyword "${searchKey}"`, error);
            }
            searchDocumentMock.verify();
        });
    });
});

