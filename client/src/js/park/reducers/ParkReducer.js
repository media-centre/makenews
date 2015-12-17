/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_PARKED_FEEDS } from "../actions/ParkActions.js";
import { List } from "immutable";

export function parkedFeeds(state = { "parkedItems": [] }, action = {}) {
    switch(action.type) {
    case DISPLAY_PARKED_FEEDS:
        return Object.assign({}, state, { "parkedItems": action.parkedItems });
    default:
        return state;
    }
}
