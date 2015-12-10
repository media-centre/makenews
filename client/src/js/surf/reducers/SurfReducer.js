/*eslint new-cap:0, no-unused-vars:0*/
"use strict";
import { DISPLAY_ALL_FEEDS } from "../actions/AllFeedsActions.js";
import { List } from "immutable";

const NEGATIVE_INDEX = -1;

export function allFeeds(state = { "feeds": List([]) }, action = {}) {
    switch(action.type) {
    case DISPLAY_ALL_FEEDS:
        return presentableItemsFromSources(action.feeds);
    default:
        return state;
    }
}

function getDateAndTime(dateString) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let date = new Date(dateString);
    return months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + "    " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

}

function createFeed(feed) {
    let feedObj = {
        "type": "description",
        "title": feed.title,
        "feedType": "rss",
        "name": feed.categoryNames.join(", "),
        "content": feed.description,
        "tags": feed.pubDate ? [getDateAndTime(feed.pubDate)] : [""]
    };
    if(feed.enclosures && feed.enclosures.length > 0) {
        if(feed.enclosures.length === 1) {
            feedObj.type = "imagecontent";
            if(feed.enclosures[0].type.indexOf("image") !== NEGATIVE_INDEX) {
                feedObj.url = feed.enclosures[0].url;
            }
        } else {
            feedObj.type = "gallery";
            feedObj.images = [];
            feed.enclosures.forEach(item => {
                if(item.type === "image/jpeg") {
                    feedObj.images.push(item);
                }
            });
        }
    }
    return feedObj;
}

function presentableItemsFromSources(feeds = []) {
    let feedResult = [];
    feeds.forEach(feed => {
        feedResult.push(createFeed(feed));
    });
    return { "feeds": feedResult };
}
