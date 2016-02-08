/* eslint no-unused-vars:0, max-params:0 */

"use strict";
import SourceDb from "../db/SourceDb.js";
import Source, { STATUS_INVALID, STATUS_VALID } from "../Source.js";
import Category from "../Category.js";
import CategoryDb from "../db/CategoryDb.js";
import { displayAllCategoriesAsync } from "./AllCategoriesActions.js";
import RssDb from "../../rss/RssDb.js";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookResponseParser from "../../facebook/FacebookResponseParser.js";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler.js";
import TwitterResponseParser from "../../twitter/TwitterResponseParser";
import RssRequestHandler from "../../rss/RssRequestHandler.js";
import RssFeeds from "../../rss/RssFeeds.js";
import TwitterDb from "../../twitter/TwitterDb";
import FacebookDb from "../../facebook/FacebookDb.js";
import DateTimeUtil from "../../utils/DateTimeUtil.js";

export const DISPLAY_CATEGORY = "DISPLAY_CATEGORY";
export const DEFAULT_CATEGORY = "Default Category";

export const RSS_TYPE = "rss";
export const FACEBOOK_TYPE = "facebook";
export const TWITTER_TYPE = "twitter";

export function populateCategoryDetailsAsync(categoryId) {
    return dispatch => {
        SourceDb.fetchSortedSourceUrlsObj(categoryId).then(sourceUrlsObj => {
            dispatch(populateCategoryDetails(sourceUrlsObj));
        }).catch((error) => {
            dispatch(populateCategoryDetails(null));
        });
    };
}

export function populateCategoryDetails(sourceUrlsObj) {
    return { "type": DISPLAY_CATEGORY, sourceUrlsObj };
}

export function addRssUrlAsync(categoryId, url, callback) {
    return dispatch => {
        RssRequestHandler.fetchRssFeeds(url).then((responseFeed) => {
            let sortedDates = DateTimeUtil.getSortedUTCDates(responseFeed.items.map(feed => {
                return feed.pubDate;
            }));
            let feeds = new RssFeeds(responseFeed.items);
            if(feeds.parse()) {
                _addUrlDocument(dispatch, categoryId, RSS_TYPE, url, STATUS_VALID, sortedDates[0]).then(documentId => {
                    feeds.save(documentId);
                    callback(STATUS_VALID);
                }).catch(error => {
                    callback(STATUS_INVALID);
                });
            } else {
                return callback(STATUS_INVALID);
            }
        }).catch(() => {
            callback(STATUS_INVALID);
        });
    };
}

export function addFacebookUrlAsync(categoryId, url, callback) {
    return dispatch => {
        FacebookRequestHandler.getPosts(url).then((originalPosts)=> {
            let sortedDates = DateTimeUtil.getSortedUTCDates(originalPosts.map(feed => {
                return feed.created_time;
            }));

            _addUrlDocument(dispatch, categoryId, FACEBOOK_TYPE, url, STATUS_VALID, sortedDates[0]).then(documentId => {
                let feedDocuments = FacebookResponseParser.parsePosts(documentId, originalPosts);
                FacebookDb.addFacebookFeeds(feedDocuments);
            });
            callback(STATUS_VALID);
        }).catch(error => {
            callback(STATUS_INVALID);
        });
    };
}

export function addTwitterUrlAsync(categoryId, url, callback) {
    return dispatch => {
        TwitterRequestHandler.fetchTweets(url).then((responseTweet) => {
            let sortedDates = DateTimeUtil.getSortedUTCDates(responseTweet.map(tweet => {
                return tweet.created_at;
            }));
            _addUrlDocument(dispatch, categoryId, TWITTER_TYPE, url, STATUS_VALID, sortedDates[0]).then(documentId => {
                let tweets = TwitterResponseParser.parseTweets(documentId, responseTweet);
                TwitterDb.addTweets(tweets);
            });
            callback(STATUS_VALID);
        }).catch(() => {
            callback(STATUS_INVALID);
        });
    };
}

export function createCategory(callback = ()=> {}) {
    return dispatch => {
        Category.instance({}).save().then(response => {
            callback(response);
        }).catch(error => {
            callback(error);
        });
    };
}

export function updateCategoryName(categoryName, categoryId, callback = ()=> {}) {
    return dispatch => {
        CategoryDb.findById(categoryId).then(category => {
            category.update({ "name": categoryName }).then(updateResponse => {
                callback({ "status": true });
            }).catch(error => {
                callback({ "status": false });
            });
        }).catch(error => {
            callback({ "status": false });
        });
    };
}

function _addUrlDocument(dispatch, categoryId, title, url, status, latestFeedTimestamp) { //eslint-disable-line max-params
    return new Promise((resolve, reject) => {
        Source.instance({ "categoryIds": [categoryId], "sourceType": title, "url": url, "status": status, "latestFeedTimestamp": latestFeedTimestamp }).save().then(response => {
            dispatch(populateCategoryDetailsAsync(categoryId));
            resolve(response.id);
        }).catch(error => {
            reject("error while creating document");
        });
    });
}
