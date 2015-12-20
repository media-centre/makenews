"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";

export const DISPLAY_PARKED_FEEDS = "DISPLAY_PARKED_FEEDS";

export function displayParkedFeeds(parkedItems) {
    return { "type": DISPLAY_PARKED_FEEDS, parkedItems };
}

export function displayParkedFeedsAsync() {
    return dispatch => {
        FeedApplicationQueries.fetchAllParkedFeeds().then((parkedItems) => {
            dispatch(displayParkedFeeds(parkedItems));
        }).catch(error => { //eslint-disable-line no-unused-vars
            dispatch(displayParkedFeeds([]));
        });
    };
}
