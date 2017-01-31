import AjaxClient from "./../../utils/AjaxClient";
import { newsBoardTabSwitch, paginatedFeeds } from "./DisplayFeedActions";
import { newsBoardSourceTypes } from "../../utils/Constants";

export const BOOKMARKED_ARTICLE = "BOOKMARKED_ARTICLE";
export const ADD_TO_COLLECTION_STATUS = "ADD_TO_COLLECTION_STATUS";
export const ADD_ARTICLE_TO_COLLECTION = "ADD_ARTICLE_TO_COLLECTION";

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

export function addToCollection(collection, article, isNewCollection = false) {
    return async dispatch => {
        let ajaxClient = AjaxClient.instance("/collection");
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        let response = await ajaxClient.put(headers, {
            "collection": collection,
            "docId": article.id,
            "isNewCollection": isNewCollection
        });
        if(response.ok === true && article.id) {
            dispatch(handleMessages("Successfully added feed to collection"));
            dispatch(newsBoardTabSwitch(article.sourceType));
        } else if(response.ok === true) {
            dispatch(handleMessages("Successfully added collection"));
            dispatch(paginatedFeeds([{ "collection": collection, "_id": collection }]));
        } else if(response.message) {
            dispatch(handleMessages(response.message));
            dispatch(newsBoardTabSwitch(article.sourceType || newsBoardSourceTypes.collection));
        } else {
            dispatch(handleMessages("Failed add feed to collection"));
        }
        dispatch(addArticleToCollection("", ""));
        dispatch(handleMessages(""));
    };
}

export function handleMessages(message) {
    return {
        "type": ADD_TO_COLLECTION_STATUS,
        "status": { message }
    };
}

export function addArticleToCollection(articleId, articleSourceType) {
    return {
        "type": ADD_ARTICLE_TO_COLLECTION,
        "addArticleToCollection": { "id": articleId, "sourceType": articleSourceType }
    };
}
