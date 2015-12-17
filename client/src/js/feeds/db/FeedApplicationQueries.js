/*eslint max-nested-callbacks:0*/
"use strict";

import FeedDb from "./FeedDb.js";

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

    static _addCategoryName(feedsAndCategoriesDocs, resolve) {
        let feeds = [];
        let categoryNameMap = FeedApplicationQueries._prepareCategoryNameMap(feedsAndCategoriesDocs);
        feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
            if (feedsAndCategoriesDoc.doc.docType === "feed") {
                feedsAndCategoriesDoc.doc.categoryNames = categoryNameMap[feedsAndCategoriesDoc.key].join(", ");
                feeds.push(feedsAndCategoriesDoc.doc);
            }
        });
        resolve(feeds);
    }

    static _prepareCategoryNameMap(feedsAndCategoriesDocs) {
        let categoryNameMap = {};
        feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
            if (feedsAndCategoriesDoc.doc.docType === "category") {
                if (categoryNameMap[feedsAndCategoriesDoc.key]) {
                    categoryNameMap[feedsAndCategoriesDoc.key].push(feedsAndCategoriesDoc.doc.name);
                } else {
                    categoryNameMap[feedsAndCategoriesDoc.key] = [feedsAndCategoriesDoc.doc.name];
                }
            }
        });
        return categoryNameMap;
    }
}
