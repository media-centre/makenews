/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import { parkCounter } from "../../../src/js/feeds/reducers/FeedReducer.js";
import { assert } from "chai";

describe("FeedReducer", function() {
    describe("parkCounter", () => {
        it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = parkCounter(undefined, action);
            assert.deepEqual(0, state);
        });

        it("should increment counter for the valid action", function() {
            let action = { "type": "INCREMENT_PARK_COUNTER" };
            var currentCounterValue = 3;
            let state = parkCounter(currentCounterValue, action);
            var expectedCounterValue = 4;
            assert.deepEqual(expectedCounterValue, state);
        });
    });
});
