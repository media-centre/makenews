/*eslint new-cap:0*/
"use strict";
import { DISPLAY_ALL_FEEDS } from "../actions/AllFeedsActions.js";
import { List } from "immutable";

export function allFeeds(state = { "feeds": List([]) }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return presentableItemsFromSources(action.sources);
    default:
        return state;
    }
}

function presentableItemsFromSources(sources = []) {
    let feeds = [];
    sources.forEach(source => {
        source.feedItems.forEach(feedItem => {
            feeds.push({
                "feedType": "rss",
                "name": source.categoryNames[0],
                "content": feedItem.description,
                "type": "description",
                "tags": []
            });
        });
    });
    return { "feeds": feeds };
}
