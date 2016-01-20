"use strict";

import RssRequestHandler from "../rss/RssRequestHandler.js";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler.js";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler.js";
import StringUtil from "../../../common/src/util/StringUtil.js";

export const RSS_TYPE = "rss";
export const FACEBOOK_TYPE = "facebook";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    fetchFeeds() {
        return new Promise((resolve, reject)=> {
            if(this.isValidateRequestData()) {
                this.fetchFeedsFromAllSources().then((feeds)=> {
                    resolve(feeds);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                reject({ "error": "Invalid url data" });
            }
        });
    }

    fetchFeedsFromAllSources() {
        return new Promise((resolve, reject)=> {
            let allFeeds = [];
            this.request.body.data.forEach((item, index)=> {
                this.fetchFeedsFromSource(item).then((feeds)=> {
                    allFeeds = allFeeds.concat(feeds);
                    if(this.request.body.data.length - 1 === index) {
                        resolve(allFeeds);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }

    fetchFeedsFromSource(item) {
        return new Promise((resolve, reject)=> {
            switch(item.source) {
            case RSS_TYPE:
                RssRequestHandler.instance().fetchRssFeedRequest(item.url).then((feeds)=> {
                    resolve(feeds);
                }).catch((err) => {
                    reject(err);
                });
                break;

            case FACEBOOK_TYPE:
                FacebookRequestHandler.instance(this.request.body.facebookAccessToken).pagePosts(item.url).then((feeds)=> {
                    resolve(feeds);
                }).catch((err) => {
                    reject(err);
                });
                break;

            case TWITTER_TYPE:
                TwitterRequestHandler.instance().fetchTweetsRequest(item.url).then((feeds)=> {
                    resolve(feeds);
                }).catch((err) => {
                    reject(err);
                });
                break;

            default: reject([]);
            }
        });
    }

    isValidateRequestData() {
        if(!this.request.body || !this.request.body.data || this.request.body.data.length === 0) {
            return false;
        }
        let errorItems = this.request.body.data.filter((item)=> {
            if(StringUtil.isEmptyString(item.source) || StringUtil.isEmptyString(item.url)) {
                return item;
            }
        });

        if(errorItems.length > 0) {
            return false;
        }
        return true;
    }
}
