/* eslint max-nested-callbacks:0, operator-assignment:0, no-unused-vars:0, no-magic-numbers:0 */


import SourceDb from "../config/db/SourceDb";
import RssFeeds from "../rss/RssFeeds";
import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import FacebookResponseParser from "../facebook/FacebookResponseParser";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import TwitterResponseParser from "../twitter/TwitterResponseParser";
import FacebookDb from "../facebook/FacebookDb";
import TwitterDb from "../twitter/TwitterDb";
import DateTimeUtil from "../utils/DateTimeUtil";
import PouchClient from "../db/PouchClient";
import AppWindow from "../utils/AppWindow";
import { displayAllFeeds } from "../surf/actions/SurfActions";

const URLS_PER_BATCH = 5;
const PERCENTAGE = 100;

export default class RefreshFeedsHandler {
    constructor(dispatch, displayAllFeedsAsync, uiCallback) {
        this.dispatch = dispatch;
        this.displayAllFeedsAsync = displayAllFeedsAsync;
        this.uiCallback = uiCallback;
        this.sourceUrlsMap = {};
        this.totalNumberOfUrls = 0;
        this.totalSuccessfullUrls = 0;
    }

    static instance(dispatch, displayAllFeedAsync, uiCallback) {
        return new RefreshFeedsHandler(dispatch, displayAllFeedAsync, uiCallback);
    }

    handleBatchRequests(skipSessionTimer = false) {
        this.fetchAllSourceUrls().then(() => {
            this.totalNumberOfUrls = this._calculateTotalUrls();
            let totalBatches = Math.ceil(this._maxCountOfUrls() / URLS_PER_BATCH);
            let lastIndex = 0;
            if(totalBatches === 0) {
                this.dispatch(this.displayAllFeedsAsync(PERCENTAGE, this.uiCallback));
                this.dispatch(displayAllFeeds([], false, 0, 0, false));
            } else {
                while(totalBatches > 0) {
                    this._handleRssBatch(this.sourceUrlsMap.rss.slice(lastIndex, lastIndex + URLS_PER_BATCH), skipSessionTimer);
                    this._handleFacebookBatch(this.sourceUrlsMap.facebook.slice(lastIndex, lastIndex + URLS_PER_BATCH), skipSessionTimer);
                    this._handleTwitterBatch(this.sourceUrlsMap.twitter.slice(lastIndex, lastIndex + URLS_PER_BATCH), skipSessionTimer);
                    lastIndex = lastIndex + URLS_PER_BATCH;
                    totalBatches = totalBatches - 1;
                }
            }
        });
    }

    _handleRssBatch(rssBatch, skipSessionTimer) {
        if(rssBatch.length > 0) {
            RssRequestHandler.fetchBatchRssFeeds(this._constructRequestData(rssBatch), skipSessionTimer).then((feedMap)=> {
                Object.keys(feedMap).map((sourceId)=> {
                    if(feedMap[sourceId] === "failed") {
                        this._updateCompletionPercentage();
                    } else {
                        let feeds = feedMap[sourceId].items;
                        let sortedDates = DateTimeUtil.getSortedUTCDates(feeds.map(feed => {
                            return feed.pubDate;
                        }));
                        let rssFeeds = RssFeeds.instance(feedMap[sourceId]);
                        rssFeeds.parse();
                        rssFeeds.save(sourceId).then(() => {
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

    _handleFacebookBatch(facebookBatch, skipSessionTimer) {
        if(facebookBatch.length > 0) {
            FacebookRequestHandler.getBatchPosts(this._constructRequestData(facebookBatch), skipSessionTimer).then((feedMap)=> {
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

    _handleTwitterBatch(twitterBatch, skipSessionTimer) {
        if(twitterBatch.length > 0) {
            TwitterRequestHandler.fetchBatchTweets(this._constructRequestData(twitterBatch), skipSessionTimer).then((feedMap)=> {
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
        return new Promise((resolve) => {
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
        let numberOfDaysToBackUp = DateTimeUtil.getCurrentTimeStamp().subtract(AppWindow.instance().get("numberOfDaysToBackUp"), "days").toISOString();
        let numberOfDaysToBackUpTimestamp = Date.parse(numberOfDaysToBackUp);
        let urls = sources.map(source => {
            let timestamp = (Date.parse(source.latestFeedTimestamp) < numberOfDaysToBackUpTimestamp) ? numberOfDaysToBackUp : source.latestFeedTimestamp;
            return { "timestamp": timestamp, "url": source.url, "id": source._id };
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
        this.dispatch(this.displayAllFeedsAsync(this._refreshCompletionPercentage(), this.uiCallback));
    }

    _updateSourceUrlWithLatestTimestamp(sourceId, latestFeedTimestamp) {
        PouchClient.getDocument(sourceId).then((sourceDoc) => {
            sourceDoc.latestFeedTimestamp = latestFeedTimestamp;
            PouchClient.updateDocument(sourceDoc);
        });
    }
}

