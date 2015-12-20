/* eslint max-nested-callbacks:0*/

"use strict";
import { displayParkedFeeds, DISPLAY_PARKED_FEEDS, displayParkedFeedsAsync } from "../../../src/js/park/actions/ParkActions";
import FeedApplicationQueries from "../../../src/js/feeds/db/FeedApplicationQueries";
import mockStore from "../../helper/ActionHelper";
import { expect } from "chai";
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
        expect(displayParkedFeeds(feeds)).to.deep.equal(dispalyParkedFeedsAction);
    });

    it("dispatch displayParkedFeedsAsync action with new feeds on successfull fetch", (done) => {
        let feeds = [
            {
                "url": "www.hindu.com",
                "categoryNames": ["hindu"],
                "items": [
                    { "title": "chennai rains", "desc": "desc" }
                ]
            }
        ];
        let fetchAllParkedFeedsMock = sinon.mock(FeedApplicationQueries).expects("fetchAllParkedFeeds");
        fetchAllParkedFeedsMock.returns(Promise.resolve(feeds));

        let store = mockStore({ "parkedItems": [] }, [{ "type": DISPLAY_PARKED_FEEDS, "parkedItems": feeds }], done);
        return Promise.resolve(store.dispatch(displayParkedFeedsAsync())).then(() => {
            fetchAllParkedFeedsMock.verify();
            FeedApplicationQueries.fetchAllParkedFeedsMock.restore();
        });
    });

    xit("dispatch displayParkedFeedsAsync action with empty feeds on  fetch failure", (done) => {
        let fetchAllParkedFeedsMock = sinon.mock(FeedApplicationQueries).expects("fetchAllParkedFeeds");
        fetchAllParkedFeedsMock.returns(Promise.reject("error"));

        let store = mockStore({ "parkedItems": [] }, [{ "type": DISPLAY_PARKED_FEEDS, "parkedItems": [] }], done);
        return Promise.resolve(store.dispatch(displayParkedFeedsAsync())).then(() => {
            fetchAllParkedFeedsMock.verify();
            FeedApplicationQueries.fetchAllParkedFeedsMock.restore();
        });
    });
});
