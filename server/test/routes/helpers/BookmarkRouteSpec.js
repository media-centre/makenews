import BookmarkRoute from "../../../src/routes/helpers/BookmarkRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import * as BookmarkRequestHandler from "../../../src/bookmark/BookmarkRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

describe("BookmarkRoute", () => {
    let sandbox = null;
    let response = null;
    let request = null;
    let bookmarkRoute = null;
    let authSession = null;
    let docId = null;
    const status = true;
    beforeEach("BookmarkRoute", () => {
        docId = "documentID";
        authSession = "AuthSession";
        response = mockResponse();
        request = {
            "body": {
                "docId": docId,
                "status": status
            },
            "cookies": {
                "AuthSession": authSession
            }
        };
        bookmarkRoute = new BookmarkRoute(request, response, {});
        sandbox = sinon.sandbox.create();
    });

    afterEach("BookmarkRoute", () => {
        sandbox.restore();
    });

    it("should bookmark the feed if docId is valid", async() => {
        const bookmarkHandlerMock = sandbox.mock(BookmarkRequestHandler).expects("bookmarkTheDocument")
            .withExactArgs(authSession, docId, status)
            .returns(Promise.resolve({ "ok": true }));

        await bookmarkRoute.bookmarkFeed();

        bookmarkHandlerMock.verify();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
    });

    it("should throw error if update is not successful", async() => {
        const bookmarkHandlerMock = sandbox.mock(BookmarkRequestHandler).expects("bookmarkTheDocument")
            .withExactArgs(authSession, docId, status)
            .returns(Promise.reject({ "error": "conflict" }));

        try{
            await bookmarkRoute.bookmarkFeed();
            bookmarkHandlerMock.verify();
            assert.fail();
        } catch(error) {
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
        }
    });
});
