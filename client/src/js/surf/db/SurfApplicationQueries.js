/*eslint max-nested-callbacks:0*/
"use strict";

import SurfDb from "./SurfDb.js";

export default class SurfApplicationQueries {
    static fetchAllFeedsWithCategoryName() {
        return new Promise((resolve, reject) => {
            SurfDb.fetchAllFeedsAndCategoriesWithSource().then((feedsAndCategoriesDocs) => {
                let feeds = [], mapOfSource = {};
                feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
                    if(feedsAndCategoriesDoc.doc.docType === "category") {
                        if (mapOfSource[feedsAndCategoriesDoc.key]) {
                            mapOfSource[feedsAndCategoriesDoc.key].push(feedsAndCategoriesDoc.doc.name);
                        } else {
                            mapOfSource[feedsAndCategoriesDoc.key] = [feedsAndCategoriesDoc.doc.name];
                        }
                    }
                });

                feedsAndCategoriesDocs.forEach(feedsAndCategoriesDoc => {
                    if (feedsAndCategoriesDoc.doc.docType === "feed") {
                        feedsAndCategoriesDoc.doc.categoryNames = mapOfSource[feedsAndCategoriesDoc.key].join(", ");
                        feeds.push(feedsAndCategoriesDoc.doc);
                    }
                });
                resolve(feeds);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
