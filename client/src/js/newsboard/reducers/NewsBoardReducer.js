import { DISPLAY_FETCHED_FEEDS } from "../actions/NewsBoardActions";
import { List } from "immutable";

export function fetchedFeeds(state = [], action = {}) {
    switch (action.type) {
    case DISPLAY_FETCHED_FEEDS:
        return Object.assign([], state, List(action.feeds).toArray()); //eslint-disable-line new-cap
    default:
        return state;
    }
}
