import { COLLECTION_FEEDS, CURRENT_COLLECTION, CLEAR_COLLECTION_FEEDS } from "./../actions/DisplayCollectionActions";

export function displayCollection(state = [], action = {}) {
    switch(action.type) {
    case COLLECTION_FEEDS: {
        return Object.assign([], state.concat(action.feeds)); //eslint-disable-line new-cap
    }
    case CLEAR_COLLECTION_FEEDS: {
        return [];
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
