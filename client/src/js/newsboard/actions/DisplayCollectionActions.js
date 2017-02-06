import AjaxClient from "./../../utils/AjaxClient";
export const COLLECTION_FEEDS = "COLLECTION_FEEDS";
export const NO_COLLECTION_FEEDS = "NO_COLLECTION_FEEDS";
export const COLLECTION_NAME = "COLLECTION_NAME";

const noCollectionFeeds = { "type": NO_COLLECTION_FEEDS };

export function displayCollectionFeeds(collection) {
    let ajaxClient = AjaxClient.instance("/collection-feeds");

    return async dispatch => {
        try {
            let feeds = await ajaxClient.get({ collection });
            dispatch(collectionFeeds(feeds));
        } catch (err) {
            dispatch(noCollectionFeeds);
        }
    };
}

export function setCollectionName(collectionName) {
    return dispatch => {
        dispatch(currentCollection(collectionName));
    };
}

function collectionFeeds(feeds) {
    return {
        "type": COLLECTION_FEEDS,
        feeds
    };
}

function currentCollection(collection) {
    return {
        "type": COLLECTION_NAME,
        collection
    };
}
