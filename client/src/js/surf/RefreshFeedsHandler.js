/* eslint max-nested-callbacks:0, operator-assignment:0, no-unused-vars:0 */

"use strict";
import AjaxClient from "../utils/AjaxClient.js";
import CategoryDb from "../config/db/CategoryDb.js";
import EnvironmentConfig from "../../js/EnvironmentConfig.js";
import RssResponseParser from "../rss/RssResponseParser.js";
import RssRequestHandler from "../rss/RssRequestHandler.js";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler.js";
import FacebookResponseParser from "../facebook/FacebookResponseParser.js";
import RssDb from "../rss/RssDb.js";
import FacebookDb from "../facebook/FacebookDb.js";

const URLS_PER_BATCH = 5;
export default class RefreshFeedsHandler {

    constructor(dispatch, displayAllFeedsAsync, uiCallback) {
        this.dispatch = dispatch;
        this.displayAllFeedsAsync = displayAllFeedsAsync;
        this.uiCallback = uiCallback;
        this.refreshInProgress = true;
        this.sourceUrlsMap = {};
        this.refreshCompletionPercentage = 0;
    }

    handleBatchRequests() {
        this.fetchAllSourceUrls().then(() => {
            let totalBatches = Math.ceil(this._maxCountOfUrls() / URLS_PER_BATCH);
            let lastIndex = 0;
            while(totalBatches > 0) {
                this._handleRssBatch(this.sourceUrlsMap.rss.slice(lastIndex, lastIndex + URLS_PER_BATCH));
                this._handleFacebookBatch(this.sourceUrlsMap.facebook.slice(lastIndex, lastIndex + URLS_PER_BATCH));
                lastIndex = lastIndex + URLS_PER_BATCH;
                totalBatches = totalBatches - 1;
            }
        });
    }

    _handleRssBatch(rssBatch) {
        if(rssBatch.length > 0) {
            RssRequestHandler.fetchBatchRssFeeds(this._constructRequestData(rssBatch)).then((feedMap)=> {
                Object.keys(feedMap).map((sourceId)=> {
                    RssDb.addRssFeeds(RssResponseParser.parseFeeds(sourceId, feedMap[sourceId].items)).then(() => {
                        this.dispatch(this.displayAllFeedsAsync(this.uiCallback, this.refreshCompletionPercentage));
                    });
                });
            });
        }
    }

    _handleFacebookBatch(facebookBatch) {
        let token = EnvironmentConfig.instance().get("facebookAccessToken");
        if(facebookBatch.length > 0) {
            FacebookRequestHandler.getBatchPosts(token, this._constructRequestData(facebookBatch)).then((feedMap)=> {
                Object.keys(feedMap.posts).map((sourceId)=> {
                    let feedDocuments = FacebookResponseParser.parsePosts(sourceId, feedMap.posts[sourceId]);
                    FacebookDb.addFacebookFeeds(feedDocuments).then(() => {
                        this.dispatch(this.displayAllFeedsAsync(this.uiCallback, this.refreshCompletionPercentage));
                    })
                });
            });
        }
    }

    fetchAllSourceUrls() {
        return new Promise((resolve, reject) => {
            if(Object.keys(this.sourceUrlsMap).length > 0) {
                resolve();
            } else {
                let sourceTypes = ["rss", "facebook", "twitter"];
                sourceTypes.forEach((sourceType, index) => {
                    CategoryDb.fetchSourceConfigurationBySourceType(sourceType).then(sources => {
                        this.sourceUrlsMap[sourceType] = sources;
                        if(sourceTypes.length - 1 === index) {
                            resolve();
                        }
                    });
                });
            }
        });
    }

    _constructRequestData(sources) {
        let urls = sources.map(source => {
            return { "timestamp": source.timestamp, "url": source.url, "id": source._id };
        });
        return { "data": urls };
    }

    _maxCountOfUrls() {
        let countOfUrls = Object.keys(this.sourceUrlsMap).map(sourceType => {
            return this.sourceUrlsMap[sourceType].length;
        });
        return Math.max(...countOfUrls);
    }
}

