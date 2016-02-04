/*eslint new-cap:0, no-unused-vars:0, max-len:0 */
"use strict";
import { DISPLAY_ALL_FEEDS, DISPLAY_EXISTING_FEEDS, PARK_FEED, STORE_FILTER_SOURCE_MAP, FETCH_ALL_CATEGORIES, PAGINATION_FEEDS } from "../actions/SurfActions.js";
import { List } from "immutable";
import Locale from "../../utils/Locale.js";


export function allFeeds(state = { "feeds": List([]).toArray(), "messages": Locale.applicationStrings().messages.surfPage }, action = {}) {
    let surfMessages = Locale.applicationStrings().messages.surfPage;
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return Object.assign({}, state, { "feeds": List(action.feeds).toArray(), "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage, "hasMoreFeeds": action.hasMoreFeeds, "lastIndex": action.lastIndex });
    case FETCH_ALL_CATEGORIES:
        return Object.assign({}, state, { "categories": action.categories });
    case DISPLAY_EXISTING_FEEDS:
        return Object.assign({}, state, { "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage });
    case PARK_FEED:
        let parkedItems = List(state.feeds);
        return Object.assign({}, state, { "feeds": List(parkedItems.delete(parkedItems.indexOf(action.feed))).toArray(), "messages": surfMessages });
    case STORE_FILTER_SOURCE_MAP:
        if(!action.surfFilter || !action.sourceHashMap) {
            action.surfFilter = state.surfFilter;
            action.sourceHashMap = state.sourceHashMap;
            action.sourceIds = state.sourceIds;
        }
        return Object.assign({}, state, { "surfFilter": action.surfFilter, "sourceHashMap": action.sourceHashMap, "sourceIds": action.sourceIds });
    case PAGINATION_FEEDS:
        action.feeds = state.feeds.concat(action.feeds);
        return Object.assign({}, state, { "feeds": action.feeds, "messages": surfMessages, "refreshState": action.refreshState, "progressPercentage": action.progressPercentage, "hasMoreFeeds": action.hasMoreFeeds, "lastIndex": action.lastIndex });
    default:
        return state;
    }
}
