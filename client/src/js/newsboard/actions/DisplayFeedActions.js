import AjaxClient from "../../../js/utils/AjaxClient";

export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
export const NEWS_BOARD_CURRENT_TAB = "NEWS_BOARD_CURRENT_TAB";
export const CLEAR_NEWS_BOARD_FEEDS = "CLEAR_NEWS_BOARD_FEEDS";
export const DISPLAY_ARTICLE = "DISPLAY_ARTICLE";
export const NEW_COLLECTION = "NEW_COLLECTION";

export const paginatedFeeds = feeds => ({
    "type": PAGINATED_FETCHED_FEEDS, feeds
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

export function displayFeedsByPage(pageIndex, sourceType, callback = () => {}) {
    let ajaxClient = AjaxClient.instance("/feeds", true);

    return _getFeeds(ajaxClient, { "offset": pageIndex, "sourceType": sourceType }, callback);
}


export function getBookmarkedFeeds(pageIndex, callback = () => {}) {
    let ajaxClient = AjaxClient.instance("/bookmarks", true);

    return _getFeeds(ajaxClient, { "offset": pageIndex }, callback);
}

export function getAllCollections(pageIndex, callback = () => {}) {
    let ajaxClient = AjaxClient.instance("/collections");

    return _getFeeds(ajaxClient, { "offset": pageIndex }, callback);
}

export async function fetchFeedsFromSources(isAuto) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    let ajaxFetch = AjaxClient.instance("/fetch-feeds", isAuto);
    await ajaxFetch.post(headers, {});
}

function _getFeeds(ajaxClient, params, callback) {
    return async dispatch => {
        try {
            let feeds = await ajaxClient.get(params);
            let result = {
                "docsLength": 0
            };
            if (feeds.docs.length) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLength = feeds.docs.length;
            }
            let defaultPageSize = 25;
            result.hasMoreFeeds = feeds.docs.length === defaultPageSize;
            callback(result); //eslint-disable-line callback-return
        } catch(err) {
            dispatch(paginatedFeeds([]));
        }
    };
}
