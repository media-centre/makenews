import { ADD_ARTICLE_TO_COLLECTION, ADD_TO_COLLECTION_STATUS } from "../actions/DisplayArticleActions";
import { WEB_ARTICLE_RECEIVED } from "./../actions/DisplayArticleActions";


export function addArticleToCollection(state = {}, action = {}) {
    switch(action.type) {
    case ADD_ARTICLE_TO_COLLECTION:
        return Object.assign({}, state, action.addArticleToCollection);
    default:
        return state;
    }
}

export function addToCollectionStatus(state = { "message": "" }, action = {}) {
    switch(action.type) {
    case ADD_TO_COLLECTION_STATUS: {
        return action.status;
    }
    default: return state;
    }
}

export function webArticleMarkup(state = { "markup": "", "isHTML": false }, action = {}) {
    switch (action.type) {
    case WEB_ARTICLE_RECEIVED: {
        return { "markup": action.article, "isHTML": action.isHTML };
    }
    default: return state;
    }
}
