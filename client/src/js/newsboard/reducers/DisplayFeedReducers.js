import { PAGINATED_FETCHED_FEEDS } from "../actions/DisplayFeedActions";
import { List } from "immutable";

export function fetchedFeeds(state = [], action = {}) {
    switch (action.type) {
    case PAGINATED_FETCHED_FEEDS:
        return Object.assign([], List(state).concat(action.feeds).toArray());  //eslint-disable-line new-cap
    default:
        return state;
    }
}
