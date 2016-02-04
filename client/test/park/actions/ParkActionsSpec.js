/* eslint max-nested-callbacks:0*/

"use strict";
import { displayParkedFeeds, DISPLAY_PARKED_FEEDS, UNPARK_FEED, displayParkedFeedsAsync, unparkFeedAsync, unparkFeed } from "../../../src/js/park/actions/ParkActions";
import * as FeedActions from "../../../src/js/feeds/actions/FeedsActions";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries";
import PouchClient from "../../../src/js/db/PouchClient";
import mockStore from "../../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("ParkActions", () => {

    describe("displayParkedFeeds", () => {
        it("return type DISPLAY_PARKED_FEEDS action", () => {
            let feeds = [
                {
                    "url": "www.hindu.com",
                    "categoryNames": ["hindu"],
                    "items": [
                        { "title": "chennai rains", "desc": "desc" }
                    ]
                }, {
                    "_id": "2",
                    "url": "www.yahoonews.com",
                    "categoryNames": ["yahoo"]
                }];

            let dispalyParkedFeedsAction = { "type": DISPLAY_PARKED_FEEDS, "parkedItems": feeds };
            assert.deepEqual(displayParkedFeeds(feeds), dispalyParkedFeedsAction);
        });
    });

    describe("unparkFeed", () => {
        it("return type UNPARK_FEED action", () => {
            let feed = { "title": "chennai rains" };

            let unparkFeedAction = { "type": UNPARK_FEED, "feed": feed };
            assert.deepEqual(unparkFeed(feed), unparkFeedAction);
        });
    });

    describe("displayParkedFeedsAsync", () => {
        let fetchAllParkedFeedsMock = null;
        beforeEach("before", () => {
            fetchAllParkedFeedsMock = sinon.mock(FeedApplicationQueries);
        });

        afterEach("after", () => {
            fetchAllParkedFeedsMock.restore();
        });

        it("dispatch displayParkedFeedsAsync action with new feeds on successful fetch", (done) => {
            let feeds = [
                {
                    "url": "www.hindu.com",
                    "categoryNames": ["hindu"],
                    "items": [
                        { "title": "chennai rains", "desc": "desc" }
                    ]
                }
            ];
            fetchAllParkedFeedsMock.expects("fetchAllParkedFeeds").returns(Promise.resolve(feeds));
            let store = mockStore({ "parkedItems": [] }, [{ "type": DISPLAY_PARKED_FEEDS, "parkedItems": feeds }], done);
            return Promise.resolve(store.dispatch(displayParkedFeedsAsync())).then(() => {
                fetchAllParkedFeedsMock.verify();
            });
        });

        it("dispatch displayParkedFeedsAsync action with empty feeds on fetch failure", (done) => {
            fetchAllParkedFeedsMock.expects("fetchAllParkedFeeds").returns(Promise.reject("error"));
            let store = mockStore({ "parkedItems": [] }, [{ "type": DISPLAY_PARKED_FEEDS, "parkedItems": [] }], done);
            return Promise.resolve(store.dispatch(displayParkedFeedsAsync())).then(() => {
                fetchAllParkedFeedsMock.verify();

            });
        });
    });

    describe("unparkFeed", () => {
        it("should change the status of given park feed to surf feed and decrement counter", (done) => {
            let feedDocument = {
                "_id": "feedId",
                "docType": "feed",
                "title": "tn",
                "description": "www.facebookpolitics.com",
                "sourceId": "rssId1"
            };

            let feedStatus = "surf";
            let store = mockStore({ "parkFeedCount": 1 }, [{ "type": UNPARK_FEED, "feed": feedDocument }, { "type": FeedActions.DECREMENT_PARK_COUNTER }], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.withExactArgs(feedDocument, feedStatus).returns(Promise.resolve({ "ok": true }));

            return Promise.resolve(store.dispatch(unparkFeedAsync(feedDocument))).then(() => {
                feedApplicationQueriesMock.verify();
                FeedApplicationQueries.updateFeed.restore();
            });
        });

        it("should not dispatch DECREMENT_PARK_COUNTER if no feed document is passed", (done) => {
            let feedDocument = {};
            let store = mockStore({}, [], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.withArgs(feedDocument).never();
            return Promise.resolve(store.dispatch(unparkFeedAsync(feedDocument))).then(() => {
                feedApplicationQueriesMock.verify();
                FeedApplicationQueries.updateFeed.restore();
            });
        });

        it("should not dispatch DECREMENT_PARK_COUNTER if feed document is undefined", (done) => {
            let store = mockStore({}, [], done);
            let feedApplicationQueriesMock = sinon.mock(FeedApplicationQueries).expects("updateFeed");
            feedApplicationQueriesMock.never();
            return Promise.resolve(store.dispatch(unparkFeedAsync())).then(() => {
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
            let store = mockStore({ "parkFeedCount": 2 }, [{ "type": UNPARK_FEED, "feed": feedDocument }, { "type": FeedActions.DECREMENT_PARK_COUNTER }], done);
            let pouchClientDeleteDcMock = sinon.mock(PouchClient).expects("deleteDocument");
            pouchClientDeleteDcMock.withArgs(feedDocument).returns(Promise.resolve({ "ok": true }));

            return Promise.resolve(store.dispatch(unparkFeedAsync(feedDocument))).then(() => {

                pouchClientDeleteDcMock.verify();
                PouchClient.deleteDocument.restore();
            });
        });
    });
});
