"use strict";

import { INCREMENT_PARK_COUNTER, INITIALISE_PARK_COUNTER, DECREMENT_PARK_COUNTER } from "../actions/FeedsActions.js";
import { displayParkedFeedsAsync } from "../../park/actions/ParkActions"

export function parkCounter(state = 0, action = {}) {
    switch (action.type) {
    case INCREMENT_PARK_COUNTER:
        return state + 1;
    case DECREMENT_PARK_COUNTER:
        return state - 1;
    case INITIALISE_PARK_COUNTER:
        return action.count || 0;
    default:
        return state;
    }
}
