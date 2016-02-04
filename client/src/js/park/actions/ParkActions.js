"use strict";

import FeedApplicationQueries from "../../feeds/db/FeedApplicationQueries.js";
import { unparkFeedCounter } from "../../feeds/actions/FeedsActions";
import PouchClient from "../../db/PouchClient";

export const DISPLAY_PARKED_FEEDS = "DISPLAY_PARKED_FEEDS";
export const UNPARK_FEED = "UNPARK_FEED";

export function displayParkedFeeds(parkedItems) {
    return { "type": DISPLAY_PARKED_FEEDS, parkedItems };
}

export function unparkFeed(feed) {
    return { "type": UNPARK_FEED, feed };
}

export function displayParkedFeedsAsync() {
    return dispatch => {
        FeedApplicationQueries.fetchAllParkedFeeds().then((parkedItems) => {
            dispatch(displayParkedFeeds(parkedItems));
        }).catch(error => { //eslint-disable-line no-unused-vars
            dispatch(displayParkedFeeds([]));
        });
    };
}

export function unparkFeedAsync(feedDoc) {
    if (feedDoc && Object.keys(feedDoc).length !== 0) {

        return dispatch => {
            if (feedDoc.sourceId === "") {
                PouchClient.deleteDocument(feedDoc).then(() => {
                    dispatch(unparkFeed(feedDoc));
                    dispatch(unparkFeedCounter());
                });
            } else {
                let status = "surf";
                FeedApplicationQueries.updateFeed(feedDoc, status).then(() => {
                    dispatch(unparkFeed(feedDoc));
                    dispatch(unparkFeedCounter());

                });
            }

        };
    }
}
