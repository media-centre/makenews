import { DISPLAY_FETCHED_FEEDS, PAGINATED_FETCHED_FEEDS } from "../actions/DisplayFeedActions";
import { List } from "immutable";

export function fetchedFeeds(state = [], action = {}) {
    switch (action.type) {
    case DISPLAY_FETCHED_FEEDS:
        return Object.assign([], state, List(action.feeds).toArray()); //eslint-disable-line new-cap
    case PAGINATED_FETCHED_FEEDS:
    return Object.assign([], List(state).concat(action.feeds).toArray());
    default:
        return state;
    }
}
