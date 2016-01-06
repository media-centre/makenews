"use strict";
import DateTimeUtil from "../../src/js/utils/DateTimeUtil.js"; //eslint-disable-line no-unused-vars
import { assert } from "chai";

describe("DateTimeUtil", ()=> {
    describe("getTimestamp", () => {
        it("should return timestamp format for given date input", () => {
            assert.strictEqual(1452026700000, DateTimeUtil.getTimestamp("2016-01-06T02:15:53.000Z"));
        });
    });

    describe("getSortedUTCDates", () => {
        it("should return dates in the most recent order", () => {
           assert.deepEqual(["Jan 8, 2016 2:15 AM", "Jan 6, 2016 2:15 AM", "Jan 5, 2016 2:15 AM"], DateTimeUtil.getSortedUTCDates(["2016-01-05T02:15:53.000Z", "2016-01-08T02:15:53.000Z", "2016-01-06T02:15:53.000Z"]));
        });
    });
});
