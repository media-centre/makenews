/* eslint no-unused-vars:0 */
"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import RefreshFeedsHandler from "../../surf/RefreshFeedsHandler.js";
import FilterFeedsHandler from "../FilterFeedsHandler.js";
export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";
export const DISPLAY_EXISTING_FEEDS = "DISPLAY_EXISTING_FEEDS";
export const PARK_FEED = "PARK_FEED";
export const STORE_FILTER_SOURCE_MAP = "STORE_FILTER_SOURCE_MAP";

let isRefreshing = false, totalPercentage = 100;

export function displayAllFeeds(feeds, refreshState, progressPercentage = 0) {
    return { "type": DISPLAY_ALL_FEEDS, feeds, refreshState, progressPercentage };
}

export function removeParkItem(feed) {
    return { "type": PARK_FEED, feed };
}

export function displayExistingFeeds(feeds, refreshState, progressPercentage = 0) {
    return { "type": DISPLAY_EXISTING_FEEDS, feeds, refreshState, progressPercentage };
}
export function storeFilterSourceMap(surfFilter, sourceHashMap) {
    return { "type": STORE_FILTER_SOURCE_MAP, surfFilter, sourceHashMap };
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
export function storeFilterAndSourceHashMap() {
    return dispatch => {
        let currentStore = dispatch(storeFilterSourceMap());
        if(!currentStore.surfFilter || !currentStore.sourceHashMap) {
            let filterFeedsHandler = new FilterFeedsHandler();
            filterFeedsHandler.getFilterAndSourceHashMap().then((result)=> {
                dispatch(storeFilterSourceMap(result.surfFilter, result.sourceHashMap));
            });
        }
    };
}
