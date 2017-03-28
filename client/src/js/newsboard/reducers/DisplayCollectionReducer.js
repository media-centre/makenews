import {
    COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS,
    DELETE_COLLECTION_FEED
} from "./../actions/DisplayCollectionActions";

export function displayCollection(state = [], action = {}) {
    switch(action.type) {
    case COLLECTION_FEEDS: {
        return Object.assign([], state.concat(action.feeds));
    }
    case CLEAR_COLLECTION_FEEDS: {
        return [];
    }
    case DELETE_COLLECTION_FEED: {
        const filteredCollection = state.filter(feed => feed._id !== action.feedId);
        return [].concat(filteredCollection);
    }
    default: return state;
    }
}

export function currentCollection(state = { "name": "", "id": "" }, action = {}) {
    switch(action.type) {
    case CURRENT_COLLECTION:
        return action.collection;
    default:
        return state;
    }
}
