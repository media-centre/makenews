import AjaxClient from "./../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";

export const COLLECTION_FEEDS = "COLLECTION_FEEDS";
export const NO_COLLECTION_FEEDS = "NO_COLLECTION_FEEDS";
export const CURRENT_COLLECTION = "CURRENT_COLLECTION";
export const CLEAR_COLLECTION_FEEDS = "CLEAR_COLLECTION_FEEDS";
export const DELETE_COLLECTION = "DELETE_COLLECTION";
export const DELETE_COLLECTION_FEED = "DELETE_COLLECTION_FEED";

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

export function setCurrentCollection(collection) {
    return {
        "type": CURRENT_COLLECTION,
        "collection": {
            "name": collection.collection,
            "id": collection._id
        }
    };
}

export const clearFeeds = () => ({
    "type": CLEAR_COLLECTION_FEEDS
});

export function deleteCollection(event, collection, firstCollection) {
    return async dispatch => {
        const ajax = AjaxClient.instance("/collection");
        const button = event.target;
        const currentCollectionClass = event.target.parentNode.className;
        button.className = "spinner";
        button.textContent = "";
        try {
            let response = await ajax.deleteRequest({ collection });
            if(response.ok) {
                dispatch({ "type": DELETE_COLLECTION, collection });
                dispatch(clearFeeds());
                if(currentCollectionClass.endsWith("active")) {
                    firstCollection.className = "collection-name active";
                }
            } else {
                throw new Error();
            }
        } catch(error) {
            button.className = "delete-collection";
            button.innerHTML = "&times";
            Toast.show("Could not delete collection");
        }
    };
}

export function deleteCollectionFeed(event, feedId, collectionId) {

    return async dispatch => {
        const ajaxClient = AjaxClient.instance("/collection-feed");
        const button = event.target;
        button.className = "spinner";
        button.textContent = "";
        try {
            const response = await ajaxClient.deleteRequest({ feedId, collectionId });
            if(response.ok) {
                dispatch({ "type": DELETE_COLLECTION_FEED, feedId });
            } else {
                throw new Error();
            }
        } catch(error) {
            button.className = "delete-feed";
            button.innerHTML = "&times";
            Toast.show("Could not to delete article");
        }
    };
}
