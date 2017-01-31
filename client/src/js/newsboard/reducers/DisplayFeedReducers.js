import {
    PAGINATED_FETCHED_FEEDS,
    NEWS_BOARD_CURRENT_TAB,
    CLEAR_NEWS_BOARD_FEEDS,
    DISPLAY_ARTICLE
} from "./../actions/DisplayFeedActions";
import {
    BOOKMARKED_ARTICLE
} from "./../actions/DisplayArticleActions";
import { List } from "immutable";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export function fetchedFeeds(state = [], action = {}) {
    switch (action.type) {
    case PAGINATED_FETCHED_FEEDS:
        return Object.assign([], List(state).concat(action.feeds).toArray());  //eslint-disable-line new-cap
    case CLEAR_NEWS_BOARD_FEEDS:
        return [];
    case BOOKMARKED_ARTICLE: {
        let article = state.find(feed => feed._id === action.articleId);
        article.bookmark = action.bookmarkStatus;
        return state;
    }
    default:
        return state;
    }
}

export function selectedArticle(state = {}, action = {}) {
    switch (action.type) {
    case DISPLAY_ARTICLE:
        return Object.assign({}, action.article);
    case BOOKMARKED_ARTICLE:
        return Object.assign({}, state, { "bookmark": action.bookmarkStatus });
    default:
        return state;
    }
}

export const newsBoardCurrentSourceTab = (state = newsBoardSourceTypes.trending, action = {}) => {
    switch(action.type) {
    case NEWS_BOARD_CURRENT_TAB: {
        return action.currentTab;
    }
    default: return state;
    }
};

