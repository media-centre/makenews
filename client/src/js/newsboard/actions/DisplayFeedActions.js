import AjaxClient from "../../../js/utils/AjaxClient";
import Toast from "./../../utils/custom_templates/Toast";

export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
export const NEWS_BOARD_CURRENT_TAB = "NEWS_BOARD_CURRENT_TAB";
export const CLEAR_NEWS_BOARD_FEEDS = "CLEAR_NEWS_BOARD_FEEDS";
export const DISPLAY_ARTICLE = "DISPLAY_ARTICLE";
export const FETCHING_FEEDS = "FETCHING_FEEDS";
export const SEARCHED_FEEDS = "SEARCHED_FEEDS";
const DEFAULT_PAGE_SIZE = 25;

export const paginatedFeeds = feeds => ({
    "type": PAGINATED_FETCHED_FEEDS, feeds
});
export const searchedFeeds = feeds => ({
    "type": SEARCHED_FEEDS, feeds
});

export const newsBoardTabSwitch = currentTab => ({
    "type": NEWS_BOARD_CURRENT_TAB, currentTab
});

export const clearFeeds = () => ({
    "type": CLEAR_NEWS_BOARD_FEEDS
});

export const displayArticle = (article) => ({
    "type": DISPLAY_ARTICLE,
    article
});

export const fetchingFeeds = (isFetching) => ({
    "type": FETCHING_FEEDS,
    isFetching
});

export function displayFeedsByPage(pageIndex, filter = {}, callback = () => {}) {
    const ajaxClient = AjaxClient.instance("/feeds");
    return _getFeeds(ajaxClient, { "offset": pageIndex, "filter": JSON.stringify(filter) }, callback);
}


export function getBookmarkedFeeds(pageIndex, callback = () => {}) {
    let ajaxClient = AjaxClient.instance("/bookmarks", true);

    return _getFeeds(ajaxClient, { "offset": pageIndex }, callback);
}

export function getAllCollections(pageIndex, callback = () => {}) {
    let ajaxClient = AjaxClient.instance("/collections");
    return _getFeeds(ajaxClient, { "offset": pageIndex }, callback);
}

export async function fetchFeedsFromSources(isAuto = false) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    const ajaxClient = AjaxClient.instance("/fetch-feeds", isAuto);
    try {
        const response = await ajaxClient.post(headers, {});
        return response.status;
    } catch(err) {
        return false;
    }
}

function _getFeeds(ajaxClient, params, callback) {
    return async dispatch => {
        let result = {
            "docsLength": 0
        };
        try {
            let feeds = await ajaxClient.get(params);
            if (feeds.docs.length) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLength = feeds.docs.length;
            }
            result.hasMoreFeeds = feeds.docs.length === DEFAULT_PAGE_SIZE;
            return callback(result);
        } catch(err) {
            dispatch(paginatedFeeds([]));
            return callback(Object.assign({}, result, { "hasMoreFeeds": false }));
        } finally {
            dispatch(fetchingFeeds(false));
        }
    };
}

export function searchFeeds(sourceType, searchKey, offset, callback) {
    return async dispatch => {
        let result = {
            "docsLength": 0
        };
        const ajax = AjaxClient.instance("/search-feeds");
        try {
            const feeds = await ajax.get({ sourceType, searchKey, offset });
            if(feeds.docs.length) {
                dispatch(searchedFeeds(feeds.docs));
                result.docsLength = feeds.docs.length;
            }
            result.hasMoreFeeds = feeds.docs.length === DEFAULT_PAGE_SIZE;
            return callback(result);
        } catch (err) {
            Toast.show(err.message);
            dispatch(clearFeeds());
            return callback(Object.assign({}, result, { "hasMoreFeeds": false }));
        }
    };
}
