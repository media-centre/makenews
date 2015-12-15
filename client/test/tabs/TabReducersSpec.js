/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

"use strict";
import "../helper/TestHelper.js";
import { highlightedTab } from "../../src/js/tabs/TabReducers.js";
import { assert } from "chai";

describe("tab reducer", function() {
    describe("highlightedTab", () => {
        it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = highlightedTab(undefined, action);
            assert.deepEqual({ "tabName": "Surf" }, state);
        });

        it("should set state tabname for change highlighted tab action", function() {
            let action = { "type": "CHANGE_HIGHLIGHTED_TAB", "tabName": "TestTab" };
            let state = highlightedTab(undefined, action);
            assert.strictEqual("TestTab", state.tabName);
        });
    });
});
