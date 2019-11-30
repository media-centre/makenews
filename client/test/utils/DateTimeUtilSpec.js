
import DateTimeUtil from "../../src/js/utils/DateTimeUtil"; //eslint-disable-line no-unused-vars
import moment from "moment";
import sinon from "sinon";
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
            let expectedSortedData = ["2016-01-08T02:15:53Z", "2016-01-06T02:15:53Z", "2016-01-05T02:15:53Z"];
            assert.deepEqual(DateTimeUtil.getSortedUTCDates(["2016-01-05T02:15:53.000Z", "2016-01-08T02:15:53.000Z", "2016-01-06T02:15:53.000Z"]),
                expectedSortedData);
        });
    });

    describe("getLocalTimeFromUTC", () => {
        let sandbox = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should return the formatted dateTime", () => {
            const timeStamp = "2017-01-31T06:58:27.000Z";
            const mock = {
                "local": () => moment("2017-01-31T06:58:27.000Z")
            };
            sandbox.stub(moment, "utc").withArgs(timeStamp).returns(mock);

            assert.strictEqual(DateTimeUtil.getLocalTimeFromUTC(timeStamp), "Tue, Jan 31, 2017 6:58 AM");
        });
    });
});
