/* eslint no-unused-vars:0, callback-return:0 */
"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import PouchClient from "../../db/PouchClient.js";
import RefreshFeedsHandler from "../../surf/RefreshFeedsHandler.js";
import FilterFeedsHandler from "../FilterFeedsHandler.js";
export const DISPLAY_ALL_FEEDS = "DISPLAY_ALL_FEEDS";
export const DISPLAY_EXISTING_FEEDS = "DISPLAY_EXISTING_FEEDS";
export const PARK_FEED = "PARK_FEED";
export const STORE_FILTER_SOURCE_MAP = "STORE_FILTER_SOURCE_MAP";
export const FETCH_ALL_CATEGORIES = "FETCH_ALL_CATEGORIES";

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
export function fetchAllCatgories(categories) {
    return { "type": FETCH_ALL_CATEGORIES, categories };
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

export function fetchAllCategories(callback) {
    return dispatch => {
        PouchClient.fetchDocuments("category/allCategories", { "include_docs": true }).then((categories) => {
            callback(categories);
            dispatch(fetchAllCatgories(categories));
        }).catch(error => { //eslint-disable-line no-unused-vars
            callback([]);
            dispatch(fetchAllCatgories([]));
        });
    };
}

export function getLatestFeedsFromAllSources(callback = ()=> {}) {
    return dispatch => {
        isRefreshing = true;
        new RefreshFeedsHandler(dispatch, displayAllFeedsAsync, callback).handleBatchRequests();
    };
}
export function storeFilterAndSourceHashMap(callback) {
    return dispatch => {
        let currentStore = dispatch(storeFilterSourceMap());
        if(!currentStore.surfFilter || !currentStore.sourceHashMap) {
            let filterFeedsHandler = new FilterFeedsHandler();
            filterFeedsHandler.getFilterAndSourceHashMap().then((result)=> {
                callback(result);
                dispatch(storeFilterSourceMap(result.surfFilter, result.sourceHashMap));
            });
        } else {
            callback(currentStore);
            dispatch(storeFilterSourceMap(currentStore.surfFilter, currentStore.sourceHashMap));
        }
    };
}

export function fetchFeedsByFilter(latestFilterDocument) {
    return dispatch => {
        let currentStore = dispatch(storeFilterSourceMap());
        currentStore.surfFilter = latestFilterDocument;
        let filterFeedsHandler = new FilterFeedsHandler();
        filterFeedsHandler.updateFilterDocument(latestFilterDocument).then(()=> {
            filterFeedsHandler.fetchFeedsByFilter(currentStore).then((feeds)=> {
                dispatch(displayAllFeeds(feeds));
            });
        });
    };
}
