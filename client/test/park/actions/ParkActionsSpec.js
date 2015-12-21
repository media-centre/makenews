/* eslint max-nested-callbacks:0*/

"use strict";
import { displayParkedFeeds, DISPLAY_PARKED_FEEDS, displayParkedFeedsAsync } from "../../../src/js/park/actions/ParkActions";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries";
import mockStore from "../../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("ParkActions", () => {
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
