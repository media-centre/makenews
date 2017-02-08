import AjaxClient from "./../../utils/AjaxClient";
export const COLLECTION_FEEDS = "COLLECTION_FEEDS";
export const NO_COLLECTION_FEEDS = "NO_COLLECTION_FEEDS";
export const COLLECTION_NAME = "COLLECTION_NAME";
export const CLEAR_COLLECTION_FEEDS = "CLEAR_COLLECTION_FEEDS";
export const READ_MORE = "READ_MORE";

const noCollectionFeeds = { "type": NO_COLLECTION_FEEDS };

export function displayCollectionFeeds(offset, collection, callback) {
    let ajaxClient = AjaxClient.instance("/collection-feeds");

    return async dispatch => {
        try {
            let feeds = await ajaxClient.get({ collection, offset });
            let result = {
                "docsLength": 0
            };
            if (feeds.length) {
                dispatch(collectionFeeds(feeds));
                result.docsLength = feeds.length;
            }
            let defaultPageSize = 25;
            result.hasMoreFeeds = feeds.length === defaultPageSize;
            callback(result); //eslint-disable-line callback-return
        } catch (err) {
            dispatch(noCollectionFeeds);
        }
    };
}

function collectionFeeds(feeds) {
    return {
        "type": COLLECTION_FEEDS,
        feeds
    };
}

export function setCollectionName(collection) {
    return {
        "type": COLLECTION_NAME,
        collection
    };
}

export function setReadMore(readMore) {
    return {
        "type": READ_MORE,
        readMore
    };
}

export const clearFeeds = () => ({
    "type": CLEAR_COLLECTION_FEEDS
});
