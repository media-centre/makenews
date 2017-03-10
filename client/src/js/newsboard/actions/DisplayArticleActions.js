import AjaxClient from "./../../utils/AjaxClient";
import { newsBoardTabSwitch, paginatedFeeds } from "./DisplayFeedActions";
import { newsBoardSourceTypes } from "../../utils/Constants";
import Toast from "./../../utils/custom_templates/Toast";

export const BOOKMARKED_ARTICLE = "BOOKMARKED_ARTICLE";
export const WEB_ARTICLE_RECEIVED = "WEB_ARTICLE_RECEIVED";
export const WEB_ARTICLE_REQUESTED = "WEB_ARTICLE_REQUESTED";
export const ADD_ARTICLE_TO_COLLECTION = "ADD_ARTICLE_TO_COLLECTION";
export const ADD_TO_COLLECTION_STATUS = "ADD_TO_COLLECTION_STATUS";

export const bookmarkedArticleAction = (articleId, bookmarkStatus) => ({
    "type": BOOKMARKED_ARTICLE,
    articleId,
    bookmarkStatus
});

export function bookmarkArticle(article) {
    let ajaxClient = AjaxClient.instance("/bookmarks");
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };

    return async dispatch => {
        let response = await ajaxClient.post(headers, {
            "docId": article._id
        });

        if(response.ok) {
            dispatch(bookmarkedArticleAction(article._id, !article.bookmark));
        }
    };
}

export function displayWebArticle(feed) {
    const ajaxClient = AjaxClient.instance("/article");

    return async dispatch => {
        dispatch(webArticleRequested());
        try {
            let article = await ajaxClient.get({ "url": feed.link });
            dispatch(articleReceived(article.markup, true));
        } catch (err) {
            Toast.show("Unable to get the article contents");
            dispatch(articleReceived(feed.description));
        }
    };
}

function webArticleRequested() {
    return {
        "type": WEB_ARTICLE_REQUESTED
    };
}

export function articleReceived(article, isHTML = false) {
    return {
        "type": WEB_ARTICLE_RECEIVED,
        article,
        isHTML
    };
}

export function addToCollection(collection, article, isNewCollection = false) {
    return async dispatch => {
        const ajaxClient = AjaxClient.instance("/collection");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        try {
            const response = await ajaxClient.put(headers, {
                "collection": collection,
                "docId": article.id,
                "isNewCollection": isNewCollection,
                "sourceId": article.sourceId
            });
            if (response.ok === true && article.id) {
                dispatch(handleMessages("Successfully added feed to collection", collection));
                dispatch(newsBoardTabSwitch(article.sourceType));
            } else if (response.ok === true) {
                dispatch(paginatedFeeds([{ "collection": collection, "_id": collection }]));
                Toast.show("Successfully created collection", "success");
            } else if (response.message) {
                dispatch(newsBoardTabSwitch(article.sourceType || newsBoardSourceTypes.collection));
                Toast.show(response.message);
            } else {
                Toast.show(isNewCollection ? "Failed to create collection" : "Failed to add feed to collection");
            }
        } catch (err) {
            Toast.show(isNewCollection ? "Failed to create collection" : "Failed to add feed to collection");
        }
        dispatch(addArticleToCollection("", "", ""));
    };
}

export function handleMessages(message, name) {
    return {
        "type": ADD_TO_COLLECTION_STATUS,
        "status": { message, name }
    };
}

export function addArticleToCollection(articleId, sourceType, sourceId) {
    return {
        "type": ADD_ARTICLE_TO_COLLECTION,
        "addArticleToCollection": { "id": articleId, sourceType, sourceId }
    };
}
