import BookmarkRoute from "../../../src/routes/helpers/BookmarkRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import BookmarkRequestHandler from "../../../src/bookmark/BookmarkRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

describe("BookmarkRoute", () => {
    let sandbox = null, response = null, request = null, bookmarkRoute = null, bookmarkHandler = null, authSession = null, docId = null;

    beforeEach("BookmarkRoute", () => {
        docId = "documentID";
        authSession = "AuthSession";
        response = mockResponse();
        request = {
            "body": {
                "docId": docId
            },
            "cookies": {
                "AuthSession": authSession
            }
        };
        bookmarkRoute = new BookmarkRoute(request, response, {});
        sandbox = sinon.sandbox.create();
        bookmarkHandler = BookmarkRequestHandler.instance();
        sandbox.mock(BookmarkRequestHandler).expects("instance").returns(bookmarkHandler);
    });

    afterEach("BookmarkRoute", () => {
        sandbox.restore();
    });

    it("should bookmark the feed if docId is valid", async() => {
        sandbox.mock(bookmarkHandler).expects("updateDocument")
            .withExactArgs(authSession, docId)
            .returns(Promise.resolve({ "ok": true }));

        await bookmarkRoute.bookmarkFeed();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
    });

    it("should throw error if update is not successful", async () => {
        sandbox.mock(bookmarkHandler).expects("updateDocument")
            .withExactArgs(authSession, docId)
            .returns(Promise.reject({ "error": "conflict" }));

        try{
            await bookmarkRoute.bookmarkFeed();
            assert.fail();
        } catch(error) {
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
        }
    });
});
