import { bookmarkTheDocument, getBookmarkedFeeds } from "../../src/bookmark/BookmarkRequestHandler";
import CouchClient from "../../src/CouchClient";
import DateUtil from "../../src/util/DateUtil";
import sinon from "sinon";
import { assert } from "chai";

describe("BookmarkRequestHandler", () => {

    describe("updateDocument", () => {
        let sandbox = null;
        let couchClient = null;
        let authSession = null;
        let dbName = null;
        beforeEach("updateDocument", () => {
            sandbox = sinon.sandbox.create();
            authSession = "authSession";
            dbName = "dbName";
            couchClient = new CouchClient(authSession, dbName);
        });

        afterEach("updateDocument", () => {
            sandbox.restore();
        });

        it("should return success response by successfully updating the doc with given bookmark status", async() => {
            const docId = "123";
            const status = false;
            const documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web"
            };

            const modifiedObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": status
            };

            const response = { "ok": true, "_id": "id", "_rev": "new rev" };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            const getDocMock = sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(docId, modifiedObj).returns(Promise.resolve(response));

            const dbResponse = await bookmarkTheDocument(authSession, docId, status);
            getDocMock.verify();
            saveDocMock.verify();
            assert.deepEqual(response, dbResponse);
        });

        it("should toggle the status if no status is provided and return the success response", async() => {
            const docId = "123";
            const documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": true
            };

            const modifiedObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": false
            };

            const response = { "ok": true, "_id": "id", "_rev": "new rev" };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            const getDocMock = sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            const saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(docId, modifiedObj).returns(Promise.resolve(response));

            const dbResponse = await bookmarkTheDocument(authSession, docId);
            getDocMock.verify();
            saveDocMock.verify();
            assert.deepEqual(response, dbResponse);
        });

        it("should throw error if updating is failed", async() => {
            const docId = "123";
            const documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web"
            };
            const response = { "error": "conflict", "reason": "Document update conflict." };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            sandbox.mock(couchClient).expects("saveDocument").withExactArgs(docId, documentObj).returns(Promise.reject(response));
            try {
                await bookmarkTheDocument(authSession, docId);
                assert.fail();
            } catch(error) {
                assert.deepEqual(response, error);
            }
        });

        it("should delete the feed when the feed is unbookmarked and source is deleted", async() => {
            const feedId = "feedId";
            const feedDoc = {
                "_id": feedId,
                "title": "feed title",
                "sourceType": "web",
                "sourceDeleted": true,
                "bookmark": true
            };

            const updatedDoc = {
                ...feedDoc,
                "_deleted": true,
                "bookmark": false
            };

            sandbox.stub(CouchClient, "instance").returns(couchClient);
            const getMock = sandbox.mock(couchClient).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.resolve(feedDoc));
            const saveMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(feedId, updatedDoc).returns(Promise.resolve({ "ok": true }));
            const respone = await bookmarkTheDocument(authSession, feedId);

            getMock.verify();
            saveMock.verify();
            assert.deepEqual(respone, { "ok": true });
        });

        it("should add the new field with current time when the bookmark status true", async() => {
            const feedId = "feedId";
            const currentTime = 12345;
            const feedDoc = {
                "_id": feedId,
                "title": "feed title",
                "sourceType": "web"
            };

            const updatedDoc = {
                ...feedDoc,
                "bookmark": true,
                "bookmarkedDate": currentTime
            };

            sandbox.stub(CouchClient, "instance").returns(couchClient);
            const getMock = sandbox.mock(couchClient).expects("getDocument")
                .withExactArgs(feedId).returns(Promise.resolve(feedDoc));
            const currentTimeMock = sandbox.mock(DateUtil).expects("getCurrentTime").returns(currentTime);

            const saveMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(feedId, updatedDoc).returns(Promise.resolve({ "ok": true }));

            const response = await bookmarkTheDocument(authSession, feedId);

            getMock.verify();
            currentTimeMock.verify();
            saveMock.verify();

            assert.deepEqual(response, { "ok": true });
        });
    });

    describe("getFeeds", () => {
        let sandbox = null;
        let authSession = null;
        const offset = 50;
        let couchClient = null;
        let selector = null;
        beforeEach("getFeeds", () => {
            sandbox = sinon.sandbox.create();
            selector = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "bookmark": {
                        "$eq": true
                    },
                    "bookmarkedDate": {
                        "$gt": null
                    }
                },
                "sort": [{ "bookmarkedDate": "desc" }],
                "skip": 50
            };
            authSession = "test_session";
            couchClient = new CouchClient();
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });
        afterEach("getFeeds", () => {
            sandbox.restore();
        });

        it("should get bookmarkedFeeds from the database", async() => {
            const feeds = {
                "docs": [
                    {
                        "_id": "1",
                        "guid": "1",
                        "title": "title1",
                        "bookmark": true,
                        "docType": "feed",
                        "sourceType": "web"
                    },
                    {
                        "_id": "2",
                        "guid": "2",
                        "title": "title2",
                        "bookmark": true,
                        "docType": "feed",
                        "sourceType": "web"
                    },
                    {
                        "_id": "3",
                        "guid": "3",
                        "title": "title3",
                        "bookmark": true,
                        "docType": "feed",
                        "sourceType": "web"
                    }
                ]
            };
            const findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.resolve(feeds));

            const docs = await getBookmarkedFeeds(authSession, offset);
            assert.deepEqual(docs, feeds);
            findDocumentsMock.verify();
        });

        it("should reject with error when database throws unexpected response", async() => {
            const findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.reject("unexpected response from the db"));
            try{
                await getBookmarkedFeeds(authSession, offset);
                findDocumentsMock.verify();
            } catch(error) {
                assert.strictEqual(error, "unexpected response from the db");
            }
        });
    });
});
