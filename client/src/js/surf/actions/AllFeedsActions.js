"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";

export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";

export function displayAllFeeds(feeds) {
    return { "type": DISPLAY_ALL_FEEDS, feeds };
}

export function displayAllFeedsAsync() {
    return dispatch => {
        FeedApplicationQueries.fetchAllFeedsWithCategoryName("surf").then((feeds) => {
            dispatch(displayAllFeeds(feeds));
        }).catch(error => { //eslint-disable-line no-unused-vars
            dispatch(displayAllFeeds([]));
        });
    };
}
