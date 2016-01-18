
"use strict";
import DateTimeUtil from "../../src/js/utils/DateTimeUtil.js"; //eslint-disable-line no-unused-vars
import { assert } from "chai";

describe("DateTimeUtil", ()=> {
    describe("getTimestamp", () => {
        it("should return timestamp format for given date input", () => { //eslint-disable-line max-nested-callbacks
            let timestamp = 1452046553000;
            assert.strictEqual(timestamp, DateTimeUtil.getTimestamp("2016-01-06T02:15:53.000Z"));
        });
    });

    describe("getSortedUTCDates", () => {
        it("should return dates in the most recent order", () => { //eslint-disable-line max-nested-callbacks
            assert.deepEqual(["2016-01-08T02:15:53+00:00", "2016-01-06T02:15:53+00:00", "2016-01-05T02:15:53+00:00"], DateTimeUtil.getSortedUTCDates(["2016-01-05T02:15:53.000Z", "2016-01-08T02:15:53.000Z", "2016-01-06T02:15:53.000Z"]));
        });
    });
});
