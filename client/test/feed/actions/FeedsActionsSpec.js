/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import * as FeedActions from "../../../src/js/feeds/actions/FeedsActions.js";
import * as AllFeedsActions from "../../../src/js/surf/actions/AllFeedsActions";
import * as ParkActions from "../../../src/js/park/actions/ParkActions.js";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries.js";
import FeedDb from "../../../src/js/feeds/db/FeedDb.js";
import mockStore from "../../helper/ActionHelper.js";
import PouchClient from "../../../src/js/db/PouchClient";
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

        let feedStatus = "park";
        let store = mockStore({ "parkFeedCount": 2 }, [{ "type": FeedActions.INCREMENT_PARK_COUNTER }, { "type": AllFeedsActions.PARK_FEED, "feed": feedDocument }], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.withExactArgs(feedDocument, feedStatus).returns(Promise.resolve({ "ok": true }));
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

describe("unparkFeeds", () => {
    it("should change the status of given park feed to surf feed and decrement counter", (done) => {
        let feedDocument = {
            "_id": "feedId",
            "docType": "feed",
            "title": "tn",
            "description": "www.facebookpolitics.com",
            "sourceId": "rssId1"
        };

        let feedStatus = "surf";
        let store = mockStore({ "parkFeedCount": 1 }, [{ "type": FeedActions.DECREMENT_PARK_COUNTER }, { "type": ParkActions.UNPARK_FEED, "feed": feedDocument }], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.withExactArgs(feedDocument, feedStatus).returns(Promise.resolve({ "ok": true }));

        return Promise.resolve(store.dispatch(FeedActions.unparkFeed(feedDocument))).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });

    it("should not dispatch DECREMENT_PARK_COUNTER if no feed document is passed", (done) => {
        let feedDocument = {};
        let store = mockStore({}, [], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.withArgs(feedDocument).never();
        return Promise.resolve(store.dispatch(FeedActions.unparkFeed(feedDocument))).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });

    it("should not dispatch DECREMENT_PARK_COUNTER if feed document is undefined", (done) => {
        let store = mockStore({}, [], done);
        let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
        feedApplicationQueriesMock.never();
        return Promise.resolve(store.dispatch(FeedActions.unparkFeed())).then(() => {
            feedApplicationQueriesMock.verify();
            FeedApplicationQueries.updateFeed.restore();
        });
    });

    it("should delete the feed from the park page if the category name is null amd decement the counter", (done) => {
        let feedDocument = {
            "_id": "feedId",
            "docType": "feed",
            "title": "tn",
            "description": "www.facebookpolitics.com",
            "sourceId": ""
        };
        let store = mockStore({ "parkFeedCount": 2 }, [{ "type": FeedActions.DECREMENT_PARK_COUNTER }, { "type": ParkActions.UNPARK_FEED, "feed": feedDocument }], done);
        let pouchClientDeleteDcMock = sinon.mock(PouchClient).expects("deleteDocument");
        pouchClientDeleteDcMock.withArgs(feedDocument).returns(Promise.resolve({ "ok": true }));

        return Promise.resolve(store.dispatch(FeedActions.unparkFeed(feedDocument))).then(() => {

            pouchClientDeleteDcMock.verify();
            PouchClient.deleteDocument.restore();
        });
    });
});

describe("initialiseParkedFeedsCount", () => {
    it("should get the count of parked feeds and dispatch the count", (done) => {
        var count = 20;
        let store = mockStore({ "parkFeedCount": 0 }, [{ "type": FeedActions.INITIALISE_PARK_COUNTER, "count": count }], done);
        let feedDbMock = sinon.mock(FeedDb).expects("parkedFeedsCount");
        feedDbMock.returns(Promise.resolve(count));
        return Promise.resolve(store.dispatch(FeedActions.initialiseParkedFeedsCount())).then(() => {
            feedDbMock.verify();
            FeedDb.parkedFeedsCount.restore();
        });
    });
});
