import {
    PAGINATED_FETCHED_FEEDS,
    NEWS_BOARD_CURRENT_TAB,
    CLEAR_NEWS_BOARD_FEEDS,
    DISPLAY_ARTICLE,
    FETCHING_FEEDS,
    SEARCHED_FEEDS,
    CLEAR_ARTICLE
} from "./../actions/DisplayFeedActions";
import {
    UPDATE_BOOKMARK_STATUS,
    WEB_ARTICLE_REQUESTED,
    WEB_ARTICLE_RECEIVED,
    UNBOOKMARK_THE_ARTICLE
} from "./../actions/DisplayArticleActions";
import { DELETE_COLLECTION, RENAMED_COLLECTION } from "../actions/DisplayCollectionActions";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export function fetchedFeeds(state = [], action = {}) {
    switch (action.type) {
    case PAGINATED_FETCHED_FEEDS:
        return state.concat(action.feeds);
    case SEARCHED_FEEDS:
        return state.concat(action.feeds);
    case CLEAR_NEWS_BOARD_FEEDS:
        return [];
    case UPDATE_BOOKMARK_STATUS: {
        const article = state.find(feed => feed._id === action.articleId);
        article.bookmark = action.bookmarkStatus;
        return state;
    }
    case UNBOOKMARK_THE_ARTICLE: {
        const updatedBookmarks = state.filter(feed => feed._id !== action.articleId);
        return [].concat(updatedBookmarks);
    }
    case DELETE_COLLECTION: {
        const updatedCollections = state.filter(collection => collection._id !== action.collection);
        return [].concat(updatedCollections);
    }
    case RENAMED_COLLECTION: {
        const filteredCollection = state.find(feed => feed._id === action.collectionId);
        filteredCollection.collection = action.newCollectionName;
        return [].concat(state);
    }
    default:
        return state;
    }
}

export function selectedArticle(state = {}, action = {}) {
    switch (action.type) {
    case DISPLAY_ARTICLE:
        return Object.assign({}, action.article);
    case UPDATE_BOOKMARK_STATUS:
        return Object.assign({}, state, { "bookmark": action.bookmarkStatus });
    case WEB_ARTICLE_REQUESTED:
        return Object.assign({}, state, { "desc": "" });
    case CLEAR_ARTICLE:
        return {};
    default:
        return state;
    }
}

export const newsBoardCurrentSourceTab = (state = newsBoardSourceTypes.web, action = {}) => {
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
