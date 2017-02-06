import { COLLECTION_FEEDS, COLLECTION_NAME } from "./../actions/DisplayCollectionActions";

export function displayCollection(state = [], action = {}) {
    switch(action.type) {
    case COLLECTION_FEEDS: {
        return Object.assign([], state.concat(action.feeds)); //eslint-disable-line new-cap
    }
    default: return state;
    }
}

export function currentCollection(state = "", action = {}) {
    switch(action.type) {
    case COLLECTION_NAME:
        return action.collection;
    default:
        return state;
    }
}
