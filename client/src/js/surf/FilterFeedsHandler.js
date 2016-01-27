/* eslint max-nested-callbacks:0 */
"use strict";

import PouchClient from "../db/PouchClient.js";
import FeedDb from "../feeds/db/FeedDb.js";
import FeedApplicationQueries from "../feeds/db/FeedApplicationQueries.js";

export default class FilterFeedsHandler {
    constructor(filter) {
        this.filter = filter;
    }

    fetchFeedsByFilter() {
        return new Promise((resolve)=> {
            resolve();
        });
    }

    getSourceAndCategoryMap() {
        return new Promise((resolve, reject)=> {
            FeedDb.fetchSurfFeedsAndCategoriesWithSource().then((feedsAndCategoriesDocs)=> {
                let sourceAndCategoryHashMap = FeedApplicationQueries._prepareCategoryNameMap(feedsAndCategoriesDocs);
                resolve(sourceAndCategoryHashMap);
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    fetchFilterDocument() {
        return PouchClient.fetchDocuments("category/surfFilter", { "include_docs": true });
    }

    getFilterAndSourceHashMap() {
        return new Promise((resolve, reject)=> {
            let count = 0, result = {};
            this.fetchFilterDocument().then((filterDocument)=> {
                count += 1;
                let newFilterDocument = this.getNewFilterDocument();
                if(filterDocument.length === 0) {
                    PouchClient.createDocument(newFilterDocument);
                }
                result.surfFilter = filterDocument.length > 0 ? filterDocument[0] : newFilterDocument;
                if(count === 2) {
                    resolve(result);
                }
            }).catch((err)=> {
                reject(err);
            });
            this.getSourceAndCategoryMap().then((sourceAndCategoryHashMap)=> {
                count += 1;
                result.sourceHashMap = sourceAndCategoryHashMap;
                if(count === 2) {
                    resolve(result);
                }
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    getNewFilterDocument() {
        return {
            "_id": "surf-filter-id",
            "docType": "surf-filter",
            "categoryIds": [],
            "content": []
        };
    }
}
