import AjaxClient from "./../../utils/AjaxClient";

export const BOOKMARKED_ARTICLE = "BOOKMARKED_ARTICLE";
export const WEB_ARTICLE = "WEB_ARTICLE";
export const FETCHING_ARTICLE_FAILED = "FETCHING_ARTICLE_FAILED";

export const bookmarkedArticleAction = (articleId, bookmarkStatus) => ({
    "type": BOOKMARKED_ARTICLE,
    articleId,
    bookmarkStatus
});

export function bookmarkArticle(article) {
    let ajaxClient = AjaxClient.instance("/bookmarks", true);
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

export function displayWebArticle(url) {
    let ajaxClient = AjaxClient.instance("/article", true);

    return async dispatch => {
        try {
            let article = await ajaxClient.get({ "url": url });
            dispatch(articleReceived(article.markup));
        }catch (err) {
            dispatch(fetchingArticleFailed);
        }
    };
}

export function articleReceived(article) {
    return {
        "type": WEB_ARTICLE,
        article
    };
}
export function fetchingArticleFailed() {
    return {
        "type": FETCHING_ARTICLE_FAILED
    };
}
