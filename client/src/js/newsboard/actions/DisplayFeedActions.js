import AjaxClient from "../../../js/utils/AjaxClient";

export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
export const NEWSBOARD_CURRENT_TAB = "NEWSBOARD_CURRENT_TAB";
export const TRENDING = "trending";
export const RSS = "rss";
export const FACEBOOK = "facebook";
export const TWITTER = "twitter";
const FEEDS_LENGTH_ZERO = 0;

export function displayFeedsByPage(pageIndex, sourceType, callback = () => {}) {
    return dispatch => {
        let ajax = AjaxClient.instance("/fetch-all-feeds", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        ajax.post(headers, { "lastIndex": pageIndex, "sourceType": sourceType }).then((feeds) => {
            let result = {
                "docsLenght": 0
            };
            if (feeds.docs.length > FEEDS_LENGTH_ZERO) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLenght = feeds.docs.length;
            }
            let defaultPageSize = 25;
            result.hasMoreFeeds = feeds.docs.length === defaultPageSize;
            callback(result);  //eslint-disable-line callback-return
        }).catch(() => {
            dispatch(paginatedFeeds([]));
        });
    };
}

export function paginatedFeeds(feeds) {
    return { "type": PAGINATED_FETCHED_FEEDS, feeds };
}

export function newsBoardTabSwitch(currentTab) {
    return {
        "type": NEWSBOARD_CURRENT_TAB,
        currentTab
    };
}
