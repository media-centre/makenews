"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";

export const INCREMENT_PARK_COUNTER = "INCREMENT_PARK_COUNTER";
export function parkFeed(feedDoc) {
    if(feedDoc && Object.keys(feedDoc).length !== 0){
        return dispatch => {
            FeedApplicationQueries.updateFeed(feedDoc).then(response => {
                dispatch(parkFeedCounter());
            });
        }
    }
}

function parkFeedCounter(){
    return { "type": INCREMENT_PARK_COUNTER };
}
