import AjaxClient from "./../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";

export const COLLECTION_FEEDS = "COLLECTION_FEEDS";
export const NO_COLLECTION_FEEDS = "NO_COLLECTION_FEEDS";
export const CURRENT_COLLECTION = "CURRENT_COLLECTION";
export const CLEAR_COLLECTION_FEEDS = "CLEAR_COLLECTION_FEEDS";
export const DELETE_COLLECTION = "DELETE_COLLECTION";

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

export function deleteCollection(event, collection) {
    return async dispatch => {
        const ajax = AjaxClient.instance("/collection");
        const button = event.target;
        button.className = "spinner";
        button.textContent = "";
        try {
            let response = await ajax.deleteRequest({ collection });
            if(response.ok) {
                dispatch({ "type": DELETE_COLLECTION, collection });
                dispatch(clearFeeds());
            } else {
                throw new Error();
            }
        } catch(error) {
            button.className = "delete-source";
            button.innerHTML = "&times";
            Toast.show("Could not delete collection");
        }
    };
}
