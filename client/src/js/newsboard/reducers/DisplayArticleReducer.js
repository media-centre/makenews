import { WEB_ARTICLE_RECEIVED } from "./../actions/DisplayArticleActions";

export function webArticleMarkup(state = "", action = {}) {
    switch (action.type) {
    case WEB_ARTICLE_RECEIVED: {
        return action.article;
    }
    default: return state;
    }
}
