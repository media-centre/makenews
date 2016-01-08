/*eslint max-nested-callbacks:0*/
"use strict";

import FeedDb from "./FeedDb.js";
import PouchClient from "../../../js/db/PouchClient";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export default class FeedApplicationQueries {
    static fetchAllFeedsWithCategoryName() {
        return new Promise((resolve, reject) => {
            FeedDb.fetchSurfFeedsAndCategoriesWithSource().then((feedsAndCategoriesDocs) => {
                FeedApplicationQueries._addCategoryName(feedsAndCategoriesDocs, resolve);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static fetchAllParkedFeeds() {
        return new Promise((resolve, reject) => {
            FeedDb.fetchParkFeeds().then((feedDocs) => {
                FeedApplicationQueries._addCategoryName(feedDocs, resolve);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static updateFeed(rawFeedDoc, status) {
        let requiredFeedDoc = Object.assign({}, rawFeedDoc, { "status": status });
        delete requiredFeedDoc.categoryNames;
        return FeedDb.updateFeed(requiredFeedDoc);
    }

    static _addCategoryName(feedsAndCategoriesDocs, resolve) {
        let feeds = [];
        let categoryNameMap = FeedApplicationQueries._prepareCategoryNameMap(feedsAndCategoriesDocs);
        feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
            if (feedsAndCategoriesDoc.doc && feedsAndCategoriesDoc.doc.docType === "feed") {
                if(StringUtil.validNonEmptyString(feedsAndCategoriesDoc.doc.sourceId)) {
                    try {
                        feedsAndCategoriesDoc.doc.categoryNames = categoryNameMap[feedsAndCategoriesDoc.doc.sourceId].join(", ");
                    } catch(error) {
                        feedsAndCategoriesDoc.doc.categoryNames = "";
                    }
                } else {
                    feedsAndCategoriesDoc.doc.categoryNames = "";
                }
                feeds.push(feedsAndCategoriesDoc.doc);
            }
        });
        resolve(feeds);
    }

    static _prepareCategoryNameMap(feedsAndCategoriesDocs) {
        let categoryNameMap = {};
        feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
            if (feedsAndCategoriesDoc.doc && feedsAndCategoriesDoc.doc.docType === "category") {
                if (categoryNameMap[feedsAndCategoriesDoc.key]) {
                    categoryNameMap[feedsAndCategoriesDoc.key].push(feedsAndCategoriesDoc.doc.name);
                } else {
                    categoryNameMap[feedsAndCategoriesDoc.key] = [feedsAndCategoriesDoc.doc.name];
                }
            }
        });
        return categoryNameMap;
    }

    static deleteSurfFeeds(sourceId) {
        return new Promise((resolve, reject) => {
            FeedDb.surfFeeds(sourceId).then((requiredSurfFeeds) => {
                requiredSurfFeeds.forEach(feed => {
                    feed._deleted = true;
                });
                PouchClient.bulkDocuments(requiredSurfFeeds).then((response)=> {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

static removeParkFeedsSourceReference(sourceId) {
    return new Promise((resolve, reject) => {
        FeedDb.sourceParkFeeds(sourceId).then(parkFeeds => {
            if(parkFeeds.length > 0) {
                parkFeeds.forEach(parkFeed => {
                    parkFeed.sourceId = "";
                });
                PouchClient.bulkDocuments(parkFeeds).then(response => { //eslint-disable-line
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
            } else {
                resolve(true);
            }
        }).catch(error => { //eslint-disable-line
            reject(false);
        });
    });
}
}

