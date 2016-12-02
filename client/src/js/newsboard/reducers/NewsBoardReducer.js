import { DISPLAY_FETCHED_FEEDS } from "../actions/NewsBoardActions";
import { List } from "immutable";

export function fetchedFeeds(state = {}, action = {}) {
    switch (action.type) {
    case DISPLAY_FETCHED_FEEDS:
        return Object.assign({}, state, {
            "feeds": List(action.feeds).toArray()
        });
    default:
        return state;
    }
}
