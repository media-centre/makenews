"use strict";

import SurfApplicationQueries from "../db/SurfApplicationQueries.js";

export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";

export function displayAllFeeds(feeds) {
    return { "type": DISPLAY_ALL_FEEDS, feeds };
}

export function displayAllFeedsAsync() {
    return dispatch => {
        SurfApplicationQueries.fetchAllFeedsWithCategoryName().then((feeds) => {
            dispatch(displayAllFeeds(feeds));
        }).catch(error => { //eslint-disable-line no-unused-vars
            dispatch(displayAllFeeds([]));
        });
    };
}
