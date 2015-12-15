"use strict";

import { CHANGE_HIGHLIGHTED_TAB } from "./TabActions.js";

export function highlightedTab(state = { "tabName": "Surf" }, action = {}) {
    switch(action.type) {
        case CHANGE_HIGHLIGHTED_TAB:
            return Object.assign({}, state, { "tabName": action.tabName });
        default:
            return state;
    }
}