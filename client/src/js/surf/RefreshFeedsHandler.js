/* eslint max-nested-callbacks:0, operator-assignment:0, no-unused-vars:0 */

"use strict";
import AjaxClient from "../utils/AjaxClient.js";
import SourceDb from "../config/db/SourceDb.js";
import RssResponseParser from "../rss/RssResponseParser.js";
import RssRequestHandler from "../rss/RssRequestHandler.js";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler.js";
import FacebookResponseParser from "../facebook/FacebookResponseParser.js";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler.js";
import TwitterResponseParser from "../twitter/TwitterResponseParser.js";
import RssDb from "../rss/RssDb.js";
import FacebookDb from "../facebook/FacebookDb.js";
import TwitterDb from "../twitter/TwitterDb.js";
import DateTimeUtil from "../utils/DateTimeUtil.js";
import PouchClient from "../db/PouchClient.js";

const URLS_PER_BATCH = 5;
export default class RefreshFeedsHandler {
    constructor(dispatch, displayAllFeedsAsync, uiCallback) {
        this.dispatch = dispatch;
        this.displayAllFeedsAsync = displayAllFeedsAsync;
        this.uiCallback = uiCallback;
        this.sourceUrlsMap = {};
        this.totalNumberOfUrls = 0;
        this.totalSuccessfullUrls = 0;
    }

    handleBatchRequests() {
        this.fetchAllSourceUrls().then(() => {
            this.totalNumberOfUrls = this._calculateTotalUrls();
            let totalBatches = Math.ceil(this._maxCountOfUrls() / URLS_PER_BATCH);
            let lastIndex = 0;
            while(totalBatches > 0) {
                this._handleRssBatch(this.sourceUrlsMap.rss.slice(lastIndex, lastIndex + URLS_PER_BATCH));
                this._handleFacebookBatch(this.sourceUrlsMap.facebook.slice(lastIndex, lastIndex + URLS_PER_BATCH));
                this._handleTwitterBatch(this.sourceUrlsMap.twitter.slice(lastIndex, lastIndex + URLS_PER_BATCH));
                lastIndex = lastIndex + URLS_PER_BATCH;
                totalBatches = totalBatches - 1;
            }
        });
    }

    _handleRssBatch(rssBatch) {
        if(rssBatch.length > 0) {
            RssRequestHandler.fetchBatchRssFeeds(this._constructRequestData(rssBatch)).then((feedMap)=> {
                Object.keys(feedMap).map((sourceId)=> {
                    if(feedMap[sourceId] === "failed") {
                        this._updateCompletionPercentage();
                    } else {
                        let feeds = feedMap[sourceId].items;
                        let sortedDates = DateTimeUtil.getSortedUTCDates(feeds.map(feed => {
                            return feed.pubDate;
                        }));
                        let parsedFeeds = RssResponseParser.parseFeeds(sourceId, feeds);
                        RssDb.addRssFeeds(parsedFeeds).then(() => {
                            if(sortedDates.length > 0) {
                                this._updateSourceUrlWithLatestTimestamp(sourceId, sortedDates[0]);
                            }
                            this._updateCompletionPercentage();
                        });
                    }
                });
            }).catch(()=> {
                this._updateCompletionPercentage();
            });
        }
    }

    _handleFacebookBatch(facebookBatch) {
        if(facebookBatch.length > 0) {
            FacebookRequestHandler.getBatchPosts(this._constructRequestData(facebookBatch)).then((feedMap)=> {
                Object.keys(feedMap.posts).map((sourceId)=> {
                    if(feedMap.posts[sourceId] === "failed") {
                        this._updateCompletionPercentage();
                    } else {
                        let feeds = feedMap.posts[sourceId];
                        let sortedDates = DateTimeUtil.getSortedUTCDates(feeds.map(feed => {
                            return feed.created_time;
                        }));

                        let feedDocuments = FacebookResponseParser.parsePosts(sourceId, feeds);
                        FacebookDb.addFacebookFeeds(feedDocuments).then(() => {
                            if(sortedDates.length > 0) {
                                this._updateSourceUrlWithLatestTimestamp(sourceId, sortedDates[0]);
                            }
                            this._updateCompletionPercentage();
                        });
                    }
                });
            }).catch(()=> {
                this._updateCompletionPercentage();
            });
        }
    }

    _handleTwitterBatch(twitterBatch) {
        if(twitterBatch.length > 0) {
            TwitterRequestHandler.fetchBatchTweets(this._constructRequestData(twitterBatch)).then((feedMap)=> {
                Object.keys(feedMap).map((sourceId)=> {

                    if(feedMap[sourceId] === "failed") {
                        this._updateCompletionPercentage();
                    } else {
                        let feeds = feedMap[sourceId].statuses;
                        let sortedDates = DateTimeUtil.getSortedUTCDates(feeds.map(feed => {
                            return feed.created_at;
                        }));

                        let feedDocuments = TwitterResponseParser.parseTweets(sourceId, feeds);
                        TwitterDb.addTweets(feedDocuments).then(() => {
                            if(sortedDates.length > 0) {
                                this._updateSourceUrlWithLatestTimestamp(sourceId, sortedDates[0]);
                            }
                            this._updateCompletionPercentage();
                        });
                    }
                });
            }).catch(()=> {
                this._updateCompletionPercentage();
            });
        }
    }

    fetchAllSourceUrls() {
        return new Promise((resolve, reject) => {
            if(Object.keys(this.sourceUrlsMap).length > 0) {
                resolve();
            } else {
                let sourceTypes = ["rss", "facebook", "twitter"];
                let counter = 0;
                sourceTypes.forEach((sourceType) => {
                    SourceDb.fetchSourceConfigurationBySourceType(sourceType).then(sources => {
                        this.sourceUrlsMap[sourceType] = sources;
                        if(sourceTypes.length - 1 === counter) {
                            resolve();
                        }
                        counter += 1;
                    });
                });
            }
        });
    }

    _constructRequestData(sources) {
        let urls = sources.map(source => {
            return { "timestamp": source.latestFeedTimestamp, "url": source.url, "id": source._id };
        });
        return { "data": urls };
    }

    _maxCountOfUrls() {
        let countOfUrls = Object.keys(this.sourceUrlsMap).map(sourceType => {
            return this.sourceUrlsMap[sourceType].length;
        });
        return Math.max(...countOfUrls);
    }

    _calculateTotalUrls() {
        let count = 0;
        Object.keys(this.sourceUrlsMap).map(sourceType => {
            count += this.sourceUrlsMap[sourceType].length;
        });
        return count;
    }

    _refreshCompletionPercentage() {
        var percentage = 100;
        return Math.ceil((percentage * this.totalSuccessfullUrls) / this.totalNumberOfUrls);
    }

    _updateCompletionPercentage() {
        this.totalSuccessfullUrls = this.totalSuccessfullUrls + 1;
        this.dispatch(this.displayAllFeedsAsync(this._refreshCompletionPercentage()));
    }

    _updateSourceUrlWithLatestTimestamp(sourceId, latestFeedTimestamp) {
        PouchClient.getDocument(sourceId).then((sourceDoc) => {
            sourceDoc.latestFeedTimestamp = latestFeedTimestamp;
            PouchClient.updateDocument(sourceDoc);
        });
    }
}

