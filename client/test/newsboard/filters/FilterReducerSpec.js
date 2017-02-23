import { currentFilter, currentFilterSource } from "../../../src/js/newsboard/filter/FilterReducer";
import { assert } from "chai";

describe("FilterReducer", () => {

    describe("currentFilter", () => {

        it("should return empty string on default", () => {
            assert.strictEqual(currentFilter(), "");
        });

        it("should return 'web' for trending ", () => {
            let action = { "type": "CURRENT_FILTER", "currentTab": "trending" };
            assert.strictEqual(currentFilter("", action), "web");
        });

        it("should return currentTab", () => {
            let action = { "type": "CURRENT_FILTER", "currentTab": "twitter" };
            assert.strictEqual(currentFilter("", action), "twitter");
        });
    });

    describe("currentFilterSource", () => {

        it("should return object with empty arrays", () => {
            assert.deepEqual(currentFilterSource(), { "web": [], "facebook": [], "twitter": [] });
        });

        it("should return filtered sources", () => {
            let sources = { "web": [{ "name": "name1" }], "facebook": [], "twitter": [] };
            let actions = { "type": "FILTERED_SOURCES", "sources": sources };
            assert.deepEqual(currentFilterSource({}, actions), sources);
        });
    });
});
