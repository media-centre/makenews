/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_ALL_FEEDS } from "../actions/AllFeedsActions.js";
import { List } from "immutable";

export function allFeeds(state = { "feeds": [] }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return { "feeds": action.feeds };
    default:
        return state;
    }
}
