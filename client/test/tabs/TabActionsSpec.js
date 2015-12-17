/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { highLightTabAction, CHANGE_HIGHLIGHTED_TAB } from "../../src/js/tabs/TabActions.js";
import mockStore from "../helper/ActionHelper.js";

describe("Tab Action", () => {
    it("should call highlighted tab action successfully", (done) => {
        const tabName1 = "Configure";
        const tabName2 = "RSS";
        const expectedActions = [
            { "type": CHANGE_HIGHLIGHTED_TAB, "tabNames": [tabName1, tabName2] }
        ];
        const store = mockStore({ "tabNames": ["Surf"] }, expectedActions, done);
        store.dispatch(highLightTabAction([tabName1, tabName2]));
    });
});

