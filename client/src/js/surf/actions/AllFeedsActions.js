/* eslint no-unused-vars:0 */
"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import RefreshFeedsHandler from "../../surf/RefreshFeedsHandler.js";
export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";

let isRefreshing = false, totalPercentage = 100;

export function displayAllFeeds(feeds, refreshState, progressPercentage = 0) {
    return { "type": DISPLAY_ALL_FEEDS, feeds, refreshState, progressPercentage };
}

export function displayAllFeedsAsync(callback, progressPercentage) {
    return dispatch => {
        FeedApplicationQueries.fetchAllFeedsWithCategoryName().then((feeds) => {
            if(progressPercentage === totalPercentage) {
                isRefreshing = false;
            }
            dispatch(displayAllFeeds(feeds, isRefreshing, progressPercentage));
            if(callback) {
                return callback(feeds);
            }
        }).catch(error => { //eslint-disable-line no-unused-vars
            if(progressPercentage === totalPercentage) {
                isRefreshing = false;
            }
            dispatch(displayAllFeeds([]));
            if(callback) {
                return callback([]);
            }
        });
    };
}

export function getLatestFeedsFromAllSources(callback = ()=> {}) {
    return dispatch => {
        isRefreshing = true;
        new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, callback).handleBatchRequests();
    };
}
