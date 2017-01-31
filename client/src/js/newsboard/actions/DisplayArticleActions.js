import AjaxClient from "./../../utils/AjaxClient";

export const BOOKMARKED_ARTICLE = "BOOKMARKED_ARTICLE";
export const WEB_ARTICLE_RECEIVED = "WEB_ARTICLE_RECEIVED";
export const WEB_ARTICLE_REQUESTED = "WEB_ARTICLE_REQUESTED";

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
    let ajaxClient = AjaxClient.instance("/article");

    return async dispatch => {
        dispatch(webArticleRequested());
        try {
            let article = await ajaxClient.get({ "url": feed.link });
            dispatch(articleReceived(article.markup, true));
        } catch (err) {
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
