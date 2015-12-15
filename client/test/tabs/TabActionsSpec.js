/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { highLightTabAction, CHANGE_HIGHLIGHTED_TAB } from "../../src/js/tabs/TabActions.js";
import mockStore from "../helper/ActionHelper.js";

describe("Tab Action", () => {
    it("should call highlighted tab action successfully", (done) => {
        const tabName = "tab";
        const expectedActions = [
            {"type": CHANGE_HIGHLIGHTED_TAB, "tabName": tabName}
        ];
        const store = mockStore({"tabName": "Surf"}, expectedActions, done);
        store.dispatch(highLightTabAction(tabName));
    });
});

