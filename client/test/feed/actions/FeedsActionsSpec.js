/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import * as FeedActions from "../../../src/js/feeds/actions/FeedsActions";
import FeedDb from "../../../src/js/feeds/db/FeedDb";
import mockStore from "../../helper/ActionHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("FeedActions", () => {
    describe("initialiseParkedFeedsCount", () => {
        it("should get the count of parked feeds and dispatch the count", (done) => {
            var count = 20;
            let store = mockStore({ "parkFeedCount": 0 }, [{ "type": FeedActions.INITIALISE_PARK_COUNTER, "count": count }], done);
            let feedDbMock = sinon.mock(FeedDb).expects("parkedFeedsCount");
            feedDbMock.returns(Promise.resolve(count));
            Promise.resolve(store.dispatch(FeedActions.initialiseParkedFeedsCount())).then(() => {
                feedDbMock.verify();
                FeedDb.parkedFeedsCount.restore();
            });
        });

    });

    describe("parkFeedCounter", () => {
        it("return type INCREMENT_PARK_COUNTER action", () => {
            let unparkFeedAction = { "type": FeedActions.INCREMENT_PARK_COUNTER };
            assert.deepEqual(FeedActions.parkFeedCounter(), unparkFeedAction);
        });
    });

    describe("unparkFeedCounter", () => {
        it("return type DECREMENT_PARK_COUNTER action", () => {
            let unparkFeedAction = { "type": FeedActions.DECREMENT_PARK_COUNTER };
            assert.deepEqual(FeedActions.unparkFeedCounter(), unparkFeedAction);
        });
    });
});
