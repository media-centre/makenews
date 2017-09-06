import {
    COLLECTION_FEEDS,
    CURRENT_COLLECTION,
    CLEAR_COLLECTION_FEEDS,
    DELETE_COLLECTION_FEED
} from "./../actions/DisplayCollectionActions";

export function displayCollection(state = { "feeds": [], "collectionId": "" }, action = {}) {
    switch(action.type) {
    case COLLECTION_FEEDS: {
        if(state.collectionId === action.collectionId) {
            return { ...state, "feeds": state.feeds.concat(...action.feeds) };
        }
        return { "feeds": action.feeds, "collectionId": action.collectionId };
    }
    case CLEAR_COLLECTION_FEEDS: {
        return { ...state, "feeds": [] };
    }
    case DELETE_COLLECTION_FEED: {
        const filteredCollection = state.feeds.filter(feed => feed._id !== action.deleteFeed);
        return { ...state, "feeds": [...filteredCollection] };
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
