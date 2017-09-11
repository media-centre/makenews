import AjaxClient from "./../../utils/AjaxClient";
import Toast from "../../utils/custom_templates/Toast";
import Locale from "./../../utils/Locale";

export const COLLECTION_FEEDS = "COLLECTION_FEEDS";
export const NO_COLLECTION_FEEDS = "NO_COLLECTION_FEEDS";
export const CURRENT_COLLECTION = "CURRENT_COLLECTION";
export const CLEAR_COLLECTION_FEEDS = "CLEAR_COLLECTION_FEEDS";
export const DELETE_COLLECTION = "DELETE_COLLECTION";
export const DELETE_COLLECTION_FEED = "DELETE_COLLECTION_FEED";
export const RENAMED_COLLECTION = "RENAMED_COLLECTION";

const noCollectionFeeds = { "type": NO_COLLECTION_FEEDS };

export const clearFeeds = () => ({
    "type": CLEAR_COLLECTION_FEEDS
});

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

export function deleteCollection(event, collection) {
    return async dispatch => {
        const ajax = AjaxClient.instance("/collection");
        const button = event.target;
        const currentCollection = event.target.parentNode;
        button.className = "spinner";
        button.textContent = "";
        try {
            let response = await ajax.deleteRequest({ collection });
            if(response.ok) {
                if((currentCollection.className).endsWith("active")) {
                    dispatch(clearFeeds());
                    currentCollection.className = "collection-name";
                }
                dispatch({ "type": DELETE_COLLECTION, collection });
            } else {
                throw new Error();
            }
        } catch(error) {
            button.className = "delete-collection";
            button.innerHTML = "&times";
            const collectionStrings = Locale.applicationStrings().messages.newsBoard.collection;
            Toast.show(collectionStrings.deleteFailure);
        }
    };
}

export function deleteCollectionFeed(event, intermediateDocId, feedId) {

    return async dispatch => {
        const ajaxClient = AjaxClient.instance("/collection-feed");
        const button = event.target;
        button.className = "spinner";
        button.textContent = "";
        try {
            const response = await ajaxClient.deleteRequest({ intermediateDocId });
            if(response.ok) {
                dispatch({ "type": DELETE_COLLECTION_FEED, "deleteFeed": feedId ? feedId : intermediateDocId });
            } else {
                throw new Error();
            }
        } catch(error) {
            const articleStrings = Locale.applicationStrings().messages.newsBoard.article;
            Toast.show(articleStrings.deleteFailure);
        }

        button.className = "delete-feed";
        button.innerHTML = "&times";
    };
}

export function renameCollection(collectionId, newCollectionName) {
    return async dispatch => {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        try {
            const ajaxClient = AjaxClient.instance("/rename-collection");
            await ajaxClient.put(headers, { collectionId, newCollectionName });
            dispatch({ "type": RENAMED_COLLECTION, collectionId, newCollectionName });
        } catch(err) {
            Toast.show(err.message);
        }
    };
}

