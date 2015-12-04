"use strict";

import SurfApplicationQueries from "../db/SurfApplicationQueries.js";

export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";

export function displayAllFeeds(sources) {
    return {"type": DISPLAY_ALL_FEEDS, sources };
}

export function displayAllFeedsAsync() {
    return dispatch => {
        SurfApplicationQueries.fetchAllSourcesWithCategoryName().then((sources) => {
            dispatch(displayAllFeeds(sources));
        }).catch(error => {
            dispatch(displayAllFeeds([]));
        });
    };
}
