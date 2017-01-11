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
});
