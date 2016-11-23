

import { INCREMENT_PARK_COUNTER, INITIALISE_PARK_COUNTER, DECREMENT_PARK_COUNTER } from "../actions/FeedsActions";

export function parkCounter(state = 0, action = {}) {               //eslint-disable-line no-magic-numbers
    switch (action.type) {
    case INCREMENT_PARK_COUNTER:
        return state + 1;                                           //eslint-disable-line no-magic-numbers
    case DECREMENT_PARK_COUNTER:
        return state - 1;                                           //eslint-disable-line no-magic-numbers
    case INITIALISE_PARK_COUNTER:
        return action.count || 0;                                   //eslint-disable-line no-magic-numbers
    default:
        return state;
    }
}
