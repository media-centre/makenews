import AjaxClient from "../../../js/utils/AjaxClient";

export const DISPLAY_FETCHED_FEEDS = "DISPLAY_FETCHED_FEEDS";
export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";


export function displayAllConfiguredFeeds() {
    return async dispatch => {
        try {
            let ajax = AjaxClient.instance("/fetch-all-feeds", true);
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            let feeds = await ajax.post(headers, { "lastIndex": 0 });
            dispatch(displayFetchedFeeds(feeds.docs));
        } catch (error) {
            dispatch(displayFetchedFeeds([]));
        }
    };
}

export function displayFetchedFeeds(feeds) {
    return { "type": DISPLAY_FETCHED_FEEDS, feeds };
}


export function displayFeedsByPage(pageIndex) {
    return async dispatch => {
        try {
            let ajax = AjaxClient.instance("/fetch-all-feeds", true);
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };

            let feeds = await ajax.post(headers, { "lastIndex": pageIndex });
            dispatch(paginatedFeeds(feeds.docs));
        } catch (error) {
            dispatch(paginatedFeeds([]));
        }

        //let filterFeedsHandler = new FilterFeedsHandler();
        //if(pageIndex === 0) { // eslint-disable-line no-magic-numbers
        //    filterFeedsHandler.getFilterAndSourceHashMap().then(latestSourceMapAndFilter => {
        //        let filterObj = dispatch(storeFilterSourceMap(latestSourceMapAndFilter.surfFilter, latestSourceMapAndFilter.sourceHashMap, latestSourceMapAndFilter.sourceIds));
        //        fetchFeeds(pageIndex, filterObj, callback, dispatch);
        //    });
        //} else {
        //    fetchFeeds(pageIndex, dispatch(storeFilterSourceMap()), callback, dispatch);
        //}
    };
}

export function paginatedFeeds(feeds) {
    return { "type": PAGINATED_FETCHED_FEEDS, feeds };
}
