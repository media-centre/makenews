/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import { parkCounter } from "../../../src/js/feeds/reducers/FeedReducer.js";
import { INCREMENT_PARK_COUNTER, INITIALISE_PARK_COUNTER } from "../../../src/js/feeds/actions/FeedsActions.js";
import { assert } from "chai";

describe("FeedReducer", function() {
    describe("parkCounter", () => {
        it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = parkCounter(undefined, action);
            assert.deepEqual(0, state);
        });

        it("should increment counter for the valid action", function() {
            let action = { "type": INCREMENT_PARK_COUNTER };
            let state = parkCounter(3, action);
            assert.deepEqual(4, state);
        });

        it("should initialise counter with parked feeds count", function() {
            let action = { "type": INITIALISE_PARK_COUNTER, count: 100 };
            let state = parkCounter(0, action);
            assert.deepEqual(100, state);
        });
    });
});
