import BookmarkRequestHandler from "../../src/bookmark/BookmarkRequestHandler";
import CouchClient from "../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("BookmarkRequestHandler", () => {

    describe("updateDocument", () => {
        let bookmarkRequestHandler = null, sandbox = null, couchClient = null, authSession = null, dbName = null;

        beforeEach("updateDocument", () => {
            bookmarkRequestHandler = BookmarkRequestHandler.instance();
            sandbox = sinon.sandbox.create();
            authSession = "authSession";
            dbName = "dbName";
            couchClient = new CouchClient(authSession, dbName);
        });

        afterEach("updateDocument", () => {
            sandbox.restore();
        });

        it("should return success response if update is successful", async () => {
            let docId = "123";
            let documentObj = {
                "_id": "123",
                "rev": "abc",
                "title": "new title",
                "sourceType": "web"
            };

            documentObj.bookmark = true;
            let response = { "ok": true, "_id": "id", "_rev": "new rev" };

            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            sandbox.mock(couchClient).expects("getDocument").withExactArgs(docId).returns(documentObj);
            sandbox.mock(couchClient).expects("saveDocument").withExactArgs(docId, documentObj).returns(Promise.resolve(response));
            try {
                let dbResponse = await bookmarkRequestHandler.updateDocument(authSession, docId);
                assert.deepEqual(response, dbResponse);
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should throw error if updation is failed", async () => {
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
                await bookmarkRequestHandler.updateDocument(authSession, docId);
                assert.fail();
            } catch(error) {
                assert.deepEqual(response, error);
            }
        });
    });

    describe("getFeeds", () => {
        let sandbox = null, bookmarkRequestHandler = null, authSession = null, offset = 50, couchClient = null, selector = null;
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
            bookmarkRequestHandler = new BookmarkRequestHandler();
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
            let docs = await bookmarkRequestHandler.getFeeds(authSession, offset);
            assert.deepEqual(docs, feeds);
            findDocumentsMock.verify();
        });

        it("should reject with error when database throws unexpected response", async () => {
            let findDocumentsMock = sandbox.mock(couchClient).expects("findDocuments");
            findDocumentsMock.withArgs(selector).returns(Promise.reject("unexpected response from the db"));
            try{
                await bookmarkRequestHandler.getFeeds(authSession, offset);
                findDocumentsMock.verify();
            } catch(error) {
                assert.strictEqual(error, "unexpected response from the db");
            }
        });
    });
});
