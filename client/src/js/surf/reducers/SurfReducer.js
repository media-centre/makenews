/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_ALL_FEEDS, DISPLAY_EXISTING_FEEDS, PARK_FEED, STORE_FILTER_SOURCE_MAP } from "../actions/AllFeedsActions.js";
import { List } from "immutable";
import Locale from "../../utils/Locale.js";


export function allFeeds(state = { "feeds": List([]).toArray(), "messages": Locale.applicationStrings().messages.surfPage }, action = {}) {
    let surfMessages = Locale.applicationStrings().messages.surfPage;
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return Object.assign({}, state, { "feeds": List(action.feeds).toArray(), "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    case DISPLAY_EXISTING_FEEDS:
        return Object.assign({}, state, { "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    case PARK_FEED:
        let parkedItems = List(state.feeds);
        return Object.assign({}, state, { "feeds": List(parkedItems.delete(parkedItems.indexOf(action.feed))).toArray(), "messages": surfMessages });
    case STORE_FILTER_SOURCE_MAP:
        if(!action.surfFilter || !action.sourceHashMap) {
            action.surfFilter = state.surfFilter;
            action.sourceHashMap = state.sourceHashMap;
        }
        return Object.assign({}, state, { "surfFilter": action.surfFilter, "sourceHashMap": action.sourceHashMap });
    default:
        return state;
    }
}
