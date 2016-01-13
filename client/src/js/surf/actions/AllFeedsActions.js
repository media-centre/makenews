/* eslint no-unused-vars:0 */
"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import RefreshFeedsHandler from "../../surf/RefreshFeedsHandler.js";
export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";

export function displayAllFeeds(feeds) {
    return { "type": DISPLAY_ALL_FEEDS, feeds };
}

export function displayAllFeedsAsync(callback) {
    return dispatch => {
        FeedApplicationQueries.fetchAllFeedsWithCategoryName().then((feeds) => {
            dispatch(displayAllFeeds(feeds));
            if(callback) {
                return callback(feeds);
            }
        }).catch(error => { //eslint-disable-line no-unused-vars
            dispatch(displayAllFeeds([]));
            if(callback) {
                return callback([]);
            }
        });
    };
}

export function getLatestFeedsFromAllSources() {
    return dispatch => {
        RefreshFeedsHandler.fetchLatestFeeds().then(feeds => {
            dispatch(displayAllFeedsAsync());
        }).catch(()=> {
            dispatch(displayAllFeedsAsync());
        });
    };
}
