"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import FeedDb from "../../feeds/db/FeedDb.js";

export const INCREMENT_PARK_COUNTER = "INCREMENT_PARK_COUNTER";
export const INITIALISE_PARK_COUNTER = "INITIALISE_PARK_COUNTER";
export function parkFeed(feedDoc) {
    if(feedDoc && Object.keys(feedDoc).length !== 0) {
        return dispatch => {
            FeedApplicationQueries.updateFeed(feedDoc).then(() => {
                dispatch(parkFeedCounter());
            });
        };
    }
}

export function initialiseParkedFeedsCount() {
    return dispatch => {
        FeedDb.parkedFeedsCount().then((count) => {
            dispatch(getParkFeedCounter(count));
        });
    };
}

function parkFeedCounter() {
    return { "type": INCREMENT_PARK_COUNTER };
}

function getParkFeedCounter(count) {
    return { "type": INITIALISE_PARK_COUNTER, count };
}
