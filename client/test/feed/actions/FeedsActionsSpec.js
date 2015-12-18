/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import * as FeedActions from "../../../src/js/feeds/actions/FeedsActions.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
import mockStore from "../../helper/ActionHelper.js";
import { expect } from "chai";
import sinon from "sinon";

describe("parkFeed", ()=> {
    it("should change status of given surf feed to park feed and increment counter", (done) => {
        let feedDocument = {
            "_id": "feedId",
            "docType": "feed",
            "title": "tn",
            "description": "www.facebookpolitics.com",
            "sourceId": "rssId1"
        };

        let store = mockStore({"parkFeedCount": 2}, [{ "type": FeedActions.INCREMENT_PARK_COUNTER }], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.withArgs(feedDocument).returns(Promise.resolve({ "ok": true }));
        return Promise.resolve(store.dispatch(FeedActions.parkFeed(feedDocument))).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });

    it("should not dispatch INCREMENT_PARK_COUNTER if no feed document is passed", (done) => {
        let feedDocument = {};
        let store = mockStore({}, [], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.withArgs(feedDocument).never();
        return Promise.resolve(store.dispatch(FeedActions.parkFeed(feedDocument))).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });

    it("should not dispatch INCREMENT_PARK_COUNTER if feed document is undefined", (done) => {
        let store = mockStore({}, [], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.never();
        return Promise.resolve(store.dispatch(FeedActions.parkFeed())).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });
});
