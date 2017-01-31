import { WEB_ARTICLE_RECEIVED } from "./../actions/DisplayArticleActions";

export function webArticleMarkup(state = { "markup": "", "isHTML": false }, action = {}) {
    switch (action.type) {
    case WEB_ARTICLE_RECEIVED: {
        return { "markup": action.article, "isHTML": action.isHTML };
    }
    default: return state;
    }
}
