/* eslint max-nested-callbacks:0, no-lonely-if:0 */
"use strict";

import PouchClient from "../db/PouchClient.js";
import FeedDb from "../feeds/db/FeedDb.js";
import FeedApplicationQueries from "../feeds/db/FeedApplicationQueries.js";

export const MAX_FEEDS_PER_PAGE = 20;
let MAX_FEEDS_PER_REQUEST = 200;


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
            let count = 0, result = {}, MAX_CHECK = 3;
            this.fetchFilterDocument().then((filterDocument)=> {
                count += 1;
                let newFilterDocument = this.getNewFilterDocument();
                if(filterDocument.length === 0) {
                    PouchClient.createDocument(newFilterDocument);
                }
                result.surfFilter = filterDocument.length > 0 ? filterDocument[0] : newFilterDocument;

                if(result.surfFilter.categories.length > 0) {
                    PouchClient.fetchDocuments("category/allSourcesBySourceType", { "include_docs": true }).then((sourceDocs)=> {
                        count += 1;
                        result.sourceIds = this.getSourceIdList(result.surfFilter.categories, sourceDocs);
                        if(count === MAX_CHECK) {
                            resolve(result);
                        }
                    });
                } else {
                    count += 1;
                    result.sourceIds = [];
                    if(count === MAX_CHECK) {
                        resolve(result);
                    }
                }
            }).catch((err)=> {
                reject(err);
            });
            this.getSourceAndCategoryMap().then((sourceAndCategoryHashMap)=> {
                count += 1;
                result.sourceHashMap = sourceAndCategoryHashMap;
                if(count === MAX_CHECK) {
                    resolve(result);
                }
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    getSourceIdList(categories, sources) {
        let NOT_FOUND = -1, sourceList = [];
        let categoryIds = categories.map(category => {
            return category._id;
        });
        sources.forEach((source)=> {
            if(source.categoryIds.filter(categoryId => {
                return categoryIds.indexOf(categoryId) !== NOT_FOUND;
            }).length > 0) {
                sourceList.push(source._id);
            }
        });
        return sourceList;
    }

    getNewFilterDocument() {
        return {
            "_id": "surf-filter-id",
            "docType": "surf-filter",
            "categories": [],
            "mediaTypes": [],
            "sourceTypes": []
        };
    }

    updateFilterDocument(latestFilterDocument) {
        return new Promise((resolve, reject)=> {
            PouchClient.getDocument("surf-filter-id").then((currentFilterDocument)=> {
                currentFilterDocument.categories = latestFilterDocument.categories;
                currentFilterDocument.mediaTypes = latestFilterDocument.mediaTypes;
                currentFilterDocument.sourceTypes = latestFilterDocument.sourceTypes;
                PouchClient.updateDocument(currentFilterDocument).then((response)=> {
                    resolve(response);
                }).catch((err)=> {
                    reject(err);
                });
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    fetchFeedsByPageWithFilter(filterObj, lastIndex = 0) { //eslint-disable-line no-unused-vars
        return new Promise((resolve, reject)=> { //eslint-disable-line no-unused-vars
            let querySkipIndex = lastIndex;
            let totalCollectedFeeds = 0;
            let lastFilteredFeed = -1;
            let NOT_FOUND = -1;
            let contentTypeFilter = filterObj.surfFilter.mediaTypes.map((item)=> {
                return item._id;
            });
            let result = {
                "feeds": [],
                "lastIndex": 0,
                "hasMoreFeeds": true
            };

            getFeedsByPage();

            function getFeedsByPage() {
                PouchClient.fetchDocuments("category/latestFeeds", {
                    "include_docs": true,
                    "descending": true,
                    "limit": MAX_FEEDS_PER_REQUEST,
                    "skip": querySkipIndex
                }).then((feeds)=> {
                    if(feeds.length === 0) {
                        resolve(result);
                    }

                    feeds.forEach((feed, index)=> {
                        if(MAX_FEEDS_PER_PAGE === totalCollectedFeeds) {
                            if(lastFilteredFeed === NOT_FOUND) {
                                lastFilteredFeed = feeds.length === 0 ? lastIndex : index;
                            }
                        } else {
                            if(filterObj.surfFilter.categories.length === 0 && contentTypeFilter.length === 0) {
                                feed.categoryNames = filterObj.sourceHashMap[feed.sourceId];
                                result.feeds.push(feed);
                                totalCollectedFeeds += 1;
                            } else if(filterObj.sourceIds.length > 0 && contentTypeFilter.length > 0) {
                                if(filterObj.sourceIds.indexOf(feed.sourceId) !== NOT_FOUND && contentTypeFilter.indexOf(feed.type) !== NOT_FOUND) {
                                    feed.categoryNames = filterObj.sourceHashMap[feed.sourceId];
                                    result.feeds.push(feed);
                                    totalCollectedFeeds += 1;
                                }
                            } else if(filterObj.sourceIds.length > 0) {
                                if(filterObj.sourceIds.indexOf(feed.sourceId) !== NOT_FOUND) {
                                    feed.categoryNames = filterObj.sourceHashMap[feed.sourceId];
                                    result.feeds.push(feed);
                                    totalCollectedFeeds += 1;
                                }
                            } else if(contentTypeFilter.length > 0 && !(filterObj.surfFilter.categories.length > 0 && filterObj.sourceIds.length === 0)) {
                                if(contentTypeFilter.indexOf(feed.type) !== NOT_FOUND) {
                                    feed.categoryNames = filterObj.sourceHashMap[feed.sourceId];
                                    result.feeds.push(feed);
                                    totalCollectedFeeds += 1;
                                }
                            }
                        }
                    });

                    if(MAX_FEEDS_PER_PAGE === totalCollectedFeeds) {
                        result.lastIndex = querySkipIndex + lastFilteredFeed;
                        resolve(result);
                    } else {
                        if(feeds.length === 0) {
                            result.lastIndex = querySkipIndex;
                            result.hasMoreFeeds = false;
                            resolve(result);
                        } else {
                            querySkipIndex += feeds.length;
                            getFeedsByPage();
                        }
                    }
                }).catch((err)=> {
                    reject(err);
                });
            }
        });
    }
}
