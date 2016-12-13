import AjaxClient from "../../../js/utils/AjaxClient";

export const DISPLAY_FETCHED_FEEDS = "DISPLAY_FETCHED_FEEDS";
export const PAGINATED_FETCHED_FEEDS = "PAGINATED_FETCHED_FEEDS";
const MAX_FEEDS_PAGE = 7;
const FEEDS_LENGTH_ZERO = 0;



export function displayFetchedFeeds(feeds) {
    return { "type": DISPLAY_FETCHED_FEEDS, feeds };
}


export function displayFeedsByPage(pageIndex, callback = () => {}) {
    return async dispatch => {
        try {
            let ajax = AjaxClient.instance("/fetch-all-feeds", true);
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            let result = {
                "docsLenght": 0,
                "hasMoreFeeds": true
            };
            let feeds = await ajax.post(headers, { "lastIndex": pageIndex });
            if(feeds.docs.length > FEEDS_LENGTH_ZERO) {
                dispatch(paginatedFeeds(feeds.docs));
                result.docsLenght = feeds.docs.length + 1;   //eslint-disable-line no-magic-numbers
                if (feeds.docs.length < MAX_FEEDS_PAGE) {
                    result.hasMoreFeeds = false;
                }
                callback(result);  //eslint-disable-line callback-return
            } else {
                callback(result);  //eslint-disable-line callback-return
            }
        } catch (error) {
            dispatch(paginatedFeeds([]));
        }
    };
}

export function paginatedFeeds(feeds) {
    return { "type": PAGINATED_FETCHED_FEEDS, feeds };
}
