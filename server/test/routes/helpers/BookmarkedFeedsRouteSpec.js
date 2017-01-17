import BookmarkedFeedsRoute from "../../../src/routes/helpers/BookmarkedFeedsRoute";
import { mockResponse } from "./../../helpers/MockResponse";
import BookmarkRequestHandler from "../../../src/bookmark/BookmarkRequestHandler";
import sinon from "sinon";
import { assert } from "chai";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

describe("BookmarkedFeedsRoute", () => {
    let sandbox = null, response = null, request = null;
    let bookmarkedFeedsRoute = null, bookmarkHandler = null, authSession = null, offset = 1;

    beforeEach("BookmarkedFeedsRoute", () => {
        authSession = "AuthSession";
        response = mockResponse();
        request = {
            "cookies": {
                "AuthSession": authSession
            },
            "query": {
                "offset": offset
            }
        };
        bookmarkedFeedsRoute = new BookmarkedFeedsRoute(request, response, {});
        sandbox = sinon.sandbox.create();
        bookmarkHandler = BookmarkRequestHandler.instance();
        sandbox.mock(BookmarkRequestHandler).expects("instance").returns(bookmarkHandler);
    });

    afterEach("BookmarkedFeedsRoute", () => {
        sandbox.restore();
    });

    it("should get the bookmarked feeds from database", async() => {
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
        sandbox.mock(bookmarkHandler).expects("getFeeds")
            .withExactArgs(authSession, offset)
            .returns(Promise.resolve(feeds));

        await bookmarkedFeedsRoute.getFeeds();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), feeds);
    });
});
