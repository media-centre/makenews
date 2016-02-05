/* eslint no-unused-vars:0, max-params:0 */

"use strict";
import CategoriesApplicationQueries from "../db/CategoriesApplicationQueries.js";
import Source, { STATUS_INVALID, STATUS_VALID } from "../Source.js";
import CategoryDb from "../db/CategoryDb.js";
import { CategoryDocument } from "./CategoryDocuments.js";
import { displayAllCategoriesAsync } from "./AllCategoriesActions.js";
import RssDb from "../../rss/RssDb.js";
import FacebookRequestHandler from "../../facebook/FacebookRequestHandler.js";
import FacebookResponseParser from "../../facebook/FacebookResponseParser.js";
import TwitterRequestHandler from "../../twitter/TwitterRequestHandler.js";
import TwitterResponseParser from "../../twitter/TwitterResponseParser";
import RssRequestHandler from "../../rss/RssRequestHandler.js";
import RssResponseParser from "../../rss/RssResponseParser";
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
        CategoriesApplicationQueries.fetchSortedSourceUrlsObj(categoryId).then(sourceUrlsObj => {
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
            _addUrlDocument(dispatch, categoryId, RSS_TYPE, url, STATUS_VALID, sortedDates[0]).then(documentId => {
                let feeds = RssResponseParser.parseFeeds(documentId, responseFeed.items);
                RssDb.addRssFeeds(feeds);
                callback(STATUS_VALID);
            }).catch(error => {
                callback(STATUS_INVALID);
            });
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

export function createDefaultCategory(categoryName = DEFAULT_CATEGORY) {
    return dispatch => {
        let newCategoryDocument = CategoryDocument.getNewCategoryDocument(categoryName);
        CategoryDb.createCategoryIfNotExists(newCategoryDocument).then(success => {
            dispatch(displayAllCategoriesAsync());
        }).catch(error => {
            dispatch(displayAllCategoriesAsync());
        });
    };
}

export function createCategory(categoryName = "", callback = ()=> {}) {
    return dispatch => {
        if(categoryName) {
            dispatchCreateCategory(categoryName);
        } else {
            generateCategoryName().then((name) => {
                dispatchCreateCategory(name);
            });
        }
    };

    function dispatchCreateCategory(categoryName1) {
        CategoryDb.createCategory(CategoryDocument.getNewCategoryDocument(categoryName1)).then(response => {
            response.name = categoryName1;
            callback(response);
        }).catch(error => {
            callback(error);
        });
    }
}

export function updateCategoryName(categoryName = "", categoryId = "", callback = ()=> {}) {
    return dispatch => {

        CategoryDb.isCategoryExists(categoryName, categoryId).then((response)=> {
            if(response.status) {
                return callback({ "status": false });
            }
            updateCategoryNameHelper(categoryName, categoryId).then((updateResponse)=> {
                callback(updateResponse);
            }).catch((error)=> {
                callback(error);
            });
        }).catch((error)=> {
            callback(error);
        });
    };
}

function updateCategoryNameHelper(categoryName, categoryId) {
    return new Promise((resolve, reject) => {
        CategoryDb.getCategoryById(categoryId).then((response)=> {
            if (response.status) {

                let categoryDoc = response.category;
                categoryDoc.name = categoryName;

                CategoryDb.updateCategory(categoryDoc).then(()=> {
                    resolve({ "status": true });
                }).catch((error)=> {
                    reject(error);
                });
            } else {
                resolve(response);
            }
        }).catch((error)=> {
            reject(error);
        });
    });
}

function generateCategoryName() {
    return new Promise((resolve, reject) => {
        let generatedName = "";
        CategoryDb.fetchAllCategoryDocuments().then(categories => {
            let existingNames = categories.map(category => category.name);
            let existingNamesSize = existingNames.length + 1;
            Array(existingNamesSize).fill().map((value, index) => index).some((index)=> {
                generatedName = "Untitled Category " + (index + 1);
                let NEGATIVE_INDEX = -1;
                if(existingNames.indexOf(generatedName) === NEGATIVE_INDEX) {
                    resolve(generatedName);
                    return true;
                }
            });
        });
    });
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

