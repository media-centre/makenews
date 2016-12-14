import AjaxClient from "../../../js/utils/AjaxClient";

export const DISPLAY_FETCHED_FEEDS = "DISPLAY_FETCHED_FEEDS";
export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
const MAX_FEEDS_PAGE = 25;
const FEEDS_LENGTH_ZERO = 0;

export function displayFetchedFeeds(feeds) {
    return { "type": DISPLAY_FETCHED_FEEDS, feeds };
}


export function displayFeedsByPage(pageIndex, callback = () => {}) {
    return dispatch => {
        let ajax = AjaxClient.instance("/fetch-all-feeds", true);
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        let result = {
            "docsLenght": 0,
            "hasMoreFeeds": true
        };
        ajax.post(headers, { "lastIndex": pageIndex }).then((feeds) => {
            if (feeds.docs.length > FEEDS_LENGTH_ZERO) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLenght = feeds.docs.length;   //eslint-disable-line no-magic-numbers
                if (feeds.docs.length < MAX_FEEDS_PAGE) {
                    result.hasMoreFeeds = false;
                }
                callback(result);  //eslint-disable-line callback-return
            } else {
                callback(result);  //eslint-disable-line callback-return
            }
        }).catch(() => {
            dispatch(paginatedFeeds([]));
        });
    };
}

export function paginatedFeeds(feeds) {
    return { "type": PAGINATED_FETCHED_FEEDS, feeds };
}
