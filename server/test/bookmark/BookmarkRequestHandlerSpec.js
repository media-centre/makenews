import { bookmarkTheDocument, getBookmarkedFeeds } from "../../src/bookmark/BookmarkRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("BookmarkRequestHandler", () => {

    describe("updateDocument", () => {
        let sandbox = null, couchClient = null, authSession = null, dbName = null;
        beforeEach("updateDocument", () => {
            sandbox = sinon.sandbox.create();
            authSession = "authSession";
            dbName = "dbName";
            couchClient = new CouchClient(authSession, dbName);
        });

        afterEach("updateDocument", () => {
            sandbox.restore();
        });

        it("should return success response by successfully updating the doc with given bookmark status", async () => {
            let docId = "123", status = false;
            let documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web"
            };

            let modifiedObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": status
            };

            let response = { "ok": true, "_id": "id", "_rev": "new rev" };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            let getDocMock = sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            let saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(docId, modifiedObj).returns(Promise.resolve(response));

            let dbResponse = await bookmarkTheDocument(authSession, docId, status);
            getDocMock.verify();
            saveDocMock.verify();
            assert.deepEqual(response, dbResponse);
        });

        it("should toggle the status if no status is provided and return the success response", async () => {
            let docId = "123";
            let documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": true
            };

            let modifiedObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web",
                "bookmark": false
            };

            let response = { "ok": true, "_id": "id", "_rev": "new rev" };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            let getDocMock = sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            let saveDocMock = sandbox.mock(couchClient).expects("saveDocument")
                .withExactArgs(docId, modifiedObj).returns(Promise.resolve(response));

            let dbResponse = await bookmarkTheDocument(authSession, docId);
            getDocMock.verify();
            saveDocMock.verify();
            assert.deepEqual(response, dbResponse);
        });

        it("should throw error if updating is failed", async () => {
            let docId = "123";
            let documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web"
            };
            let response = { "error": "conflict", "reason": "Document update conflict." };

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

        it("should delete the feed when the feed is unbookmarked and source is deleted", async () => {
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
    });

    describe("getFeeds", () => {
        let sandbox = null, authSession = null, offset = 50, couchClient = null, selector = null;
        beforeEach("getFeeds", () => {
            sandbox = sinon.sandbox.create();
            selector = {
                "selector": {
                    "docType": {
                        "$eq": "feed"
                    },
                    "bookmark": {
                        "$eq": true
                    }
                },
                "skip": 50
            };
            authSession = "test_session";
            couchClient = new CouchClient();
            sandbox.stub(CouchClient, "instance").returns(couchClient);
        });
        afterEach("getFeeds", () => {
            sandbox.restore();
        });

        it("should get bookmarkedFeeds from the database", async () => {
            let feeds = {
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
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.resolve(feeds));

            let docs = await getBookmarkedFeeds(authSession, offset);
            assert.deepEqual(docs, feeds);
            findDocumentsMock.verify();
        });

        it("should reject with error when database throws unexpected response", async () => {
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
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
