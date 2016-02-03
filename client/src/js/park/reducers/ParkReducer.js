/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_PARKED_FEEDS, UNPARK_FEED } from "../actions/ParkActions.js";
import { List } from "immutable";

export function parkedFeeds(state = { "parkedItems": List([]).toArray() }, action = {}) {
    switch(action.type) {
    case DISPLAY_PARKED_FEEDS:
        return Object.assign({}, state, { "parkedItems": List(action.parkedItems).toArray() });
    case UNPARK_FEED:
        let parkedItems = List(state.parkedItems);
        return Object.assign({}, state, { "parkedItems": List(parkedItems.delete(parkedItems.indexOf(action.feed))).toArray() });
    default:
        return state;
    }
}
