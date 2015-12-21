"use strict";

import { INCREMENT_PARK_COUNTER, INITIALISE_PARK_COUNTER } from "../actions/FeedsActions.js";

export function parkCounter(state = 0, action = {}) {
    switch (action.type) {
    case INCREMENT_PARK_COUNTER:
        return state + 1;
    case INITIALISE_PARK_COUNTER:
        return action.count;
    default:
        return state;
    }
}
