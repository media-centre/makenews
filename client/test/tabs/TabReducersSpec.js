/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-undefined:0 */

import "../helper/TestHelper";
import { highlightedTab } from "../../src/js/tabs/TabReducers";
import { assert } from "chai";
import { List } from "immutable";

describe("tab reducer", function() {
    describe("highlightedTab", () => {
        it("default state if action type is not handled", function() {
            let action = { "type": "undefined" };
            let state = highlightedTab(undefined, action);
            let tabs = new List(["Surf"]);
            assert.deepEqual({ "tabNames": tabs }, state);
        });

        it("should set state tabname for change highlighted tab action", function() {
            let action = { "type": "CHANGE_HIGHLIGHTED_TAB", "tabNames": ["Configure", "RSS"] };
            let state = highlightedTab(undefined, action);
            let tabs = new List(["Configure", "RSS"]);
            assert.deepEqual(tabs, state.tabNames);
        });
    });
});
