/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_ALL_FEEDS } from "../actions/AllFeedsActions.js";
import { List } from "immutable";
import Locale from "../../utils/Locale.js";

let surfMessages = Locale.applicationStrings().messages.surfPage;

export function allFeeds(state = { "feeds": [], "messages": surfMessages }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return Object.assign({}, state, { "feeds": action.feeds, "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    default:
        return state;
    }
}
