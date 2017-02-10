import AjaxClient from "../../../js/utils/AjaxClient";

export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
export const NEWS_BOARD_CURRENT_TAB = "NEWS_BOARD_CURRENT_TAB";
export const CLEAR_NEWS_BOARD_FEEDS = "CLEAR_NEWS_BOARD_FEEDS";
export const DISPLAY_ARTICLE = "DISPLAY_ARTICLE";

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
        let result = {
            "docsLength": 0
        };
        try {
            let feeds = await ajaxClient.get(params);
            if (feeds.docs.length) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLength = feeds.docs.length;
            }
            const defaultPageSize = 25;
            result.hasMoreFeeds = feeds.docs.length === defaultPageSize;
            return callback(result); //eslint-disable-line callback-return
        } catch(err) {
            dispatch(paginatedFeeds([]));
            return callback(Object.assign({}, result, { "hasMoreFeeds": false }));
        }
    };
}
