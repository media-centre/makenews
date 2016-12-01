import AjaxClient from "../../../js/utils/AjaxClient";

export const DISPLAY_FETCHED_FEEDS = "DISPLAY_FETCHED_FEEDS";


export async function displayAllConfiguredFeeds() {
    return async dispatch => {
        try {
            let ajax = AjaxClient.instance("/fetch-all-feeds", true);
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json"
            };
            let feeds = await ajax.post(headers, {});
            dispatch(displayFetchedFeeds(feeds));
        }catch (error) {
            dispatch(displayFetchedFeeds([]));
        }
    };
}

export function displayFetchedFeeds(feeds) {
    return { "type": DISPLAY_FETCHED_FEEDS, feeds };
}
