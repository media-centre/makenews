/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import { parkCounter } from "../../../src/js/feeds/reducers/FeedReducer.js";
import { INCREMENT_PARK_COUNTER, INITIALISE_PARK_COUNTER, DECREMENT_PARK_COUNTER } from "../../../src/js/feeds/actions/FeedsActions.js";
import { assert } from "chai";

describe("FeedReducer", function() {
    describe("parkCounter", () => {
        it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = parkCounter(undefined, action);
            assert.deepEqual(0, state);
        });

        it("should increment counter for the valid action", function() {
            let action = { "type": INCREMENT_PARK_COUNTER }, initialCount = 3, expectedCount = 4;
            let state = parkCounter(initialCount, action);
            assert.deepEqual(expectedCount, state);
        });

        it("should initialise counter with parked feeds count", function() {
            let initialCount = 100;
            let action = { "type": INITIALISE_PARK_COUNTER, "count": initialCount };
            let state = parkCounter(0, action);
            assert.deepEqual(initialCount, state);
        });

        it("should initialise counter with 0 if the action count is undefined", function() {
            let action = { "type": INITIALISE_PARK_COUNTER, "count": undefined };
            let state = parkCounter(0, action);
            assert.deepEqual(0, state);
        });

        it("should decrement counter for the valid action", function() {
            let action = { "type": DECREMENT_PARK_COUNTER }, initialCount = 3, expectedCount = 2;
            let state = parkCounter(initialCount, action);
            assert.deepEqual(expectedCount, state);
        });
    });
});
