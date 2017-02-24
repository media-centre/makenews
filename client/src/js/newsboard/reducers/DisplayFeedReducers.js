import {
    PAGINATED_FETCHED_FEEDS,
    NEWS_BOARD_CURRENT_TAB,
    CLEAR_NEWS_BOARD_FEEDS,
    DISPLAY_ARTICLE,
    FETCHING_FEEDS
} from "./../actions/DisplayFeedActions";
import {
    BOOKMARKED_ARTICLE,
    WEB_ARTICLE_REQUESTED,
    WEB_ARTICLE_RECEIVED
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
    case WEB_ARTICLE_REQUESTED:
        return Object.assign({}, state, { "desc": "" });
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

export function fetchingWebArticle(state = false, action = {}) {
    switch(action.type) {
    case WEB_ARTICLE_REQUESTED:
        return true;
    case WEB_ARTICLE_RECEIVED:
        return false;
    default: return state;
    }
}

export function fetchingFeeds(state = false, action = {}) {
    if(action.type === FETCHING_FEEDS) {
        return action.isFetching;
    }
    return state;
}

