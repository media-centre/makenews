
import FeedDb from "../db/FeedDb";

export const INCREMENT_PARK_COUNTER = "INCREMENT_PARK_COUNTER";
export const DECREMENT_PARK_COUNTER = "DECREMENT_PARK_COUNTER";
export const INITIALISE_PARK_COUNTER = "INITIALISE_PARK_COUNTER";

export function initialiseParkedFeedsCount() {
    return dispatch => {
        FeedDb.parkedFeedsCount().then((count) => {
            dispatch(getParkFeedCounter(count));
        });
    };
}

export function parkFeedCounter() {
    return { "type": INCREMENT_PARK_COUNTER };
}

export function unparkFeedCounter() {
    return { "type": DECREMENT_PARK_COUNTER };
}

function getParkFeedCounter(count) {
    return { "type": INITIALISE_PARK_COUNTER, count };
}
