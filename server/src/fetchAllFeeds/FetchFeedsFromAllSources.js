import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import StringUtil from "../../../common/src/util/StringUtil";
import Logger from "../logging/Logger";
import CouchClient from "../../src/CouchClient.js";

export const RSS_TYPE = "rss";
export const FACEBOOK_TYPE = "facebook";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources {
    constructor(request, response) {
        this.request = request;
        this.response = response;
        this.accesstoken = request.cookies.AuthSession;
        console.log(1);
    }

    static logger() {
        return Logger.instance();
    }

    fetchFeeds() {

        return new Promise((resolve, reject)=> {
            if (this.isValidateRequestData()) {
                this.fetchFeedsFromAllSources().then((feeds)=> {

                    FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds.");
                    console.log(feeds) 
                    resolve(feeds);

                }).catch((err) => {
                    console.log(4);

                    FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
                    reject(err);
                });
            } else {
                console.log(5);

                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: Invalid url data.");
                reject({ "error": "Invalid url data" });
            }
        });
    }

    fetchFeedsFromAllSources() {
        return new Promise((resolve, reject)=> {
            let allFeeds = [];
            let urlDocuments = this._getUrlDocuments();
            urlDocuments.forEach((item, index)=> {
                this.fetchFeedsFromSource(item).then((feeds)=> {
                    allFeeds = allFeeds.concat(feeds);
                    this.saveFeedDocumentsToDb(feeds).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                    if (this.request.body.data.length - 1 === index) {  // eslint-disable-line no-magic-numbers
                        FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds from all sources.");
                    }
                }).catch((err) => {
                    FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
                    reject(err);
                });
            });
        });
    }

    async _getUrlDocuments() {
        let couchClient = await CouchClient.createInstance(this.accesstoken);
        let selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            }
        };
        let response = await couchClient.findDocuments(selector);
        console.log(response);

    }

    async fetchFeedsFromSource(item) {
        let feeds = null;
        switch (item.sourceType) {

        case RSS_TYPE:
            try {
                console.log(6);

                feeds = await RssRequestHandler.instance().fetchBatchRssFeedsRequest(item._id);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched rss feeds from all sources.");
                return feeds;
            } catch (err) {
                console.log(err);

                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching rss feeds. Error: %s", err);
                throw(err);
            }

        case FACEBOOK_TYPE:
            try {
                console.log(10);
                feeds = await FacebookRequestHandler.instance(this.request.body.facebookAccessToken).pagePosts(item._id);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched facebook feeds from all sources.");
                return feeds;

            } catch (err) {
                console.log(err);
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching facebook feeds. Error: %s", err);
                throw(err);
            }

        case TWITTER_TYPE:
            try {
                feeds = await TwitterRequestHandler.instance().fetchTweetsRequest(item._id);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched twitter feeds from all sources.");
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching twitter feeds. Error: %s", err);
                throw(err);
            }

        default:
            throw([]);
        }
    }

    isValidateRequestData() {
        if (!this.request.body || !this.request.body.data || this.request.body.data.length === 0) {      // eslint-disable-line no-magic-numbers
            return false;
        }
        let errorItems = this.request.body.data.filter((item) => {                                      //eslint-disable-line consistent-return
            if (StringUtil.isEmptyString(item.source) || StringUtil.isEmptyString(item.url)) {
                return item;
            }
        });

        return errorItems.length <= 0;             // eslint-disable-line no-magic-numbers

    }

    async saveFeedDocumentsToDb(feeds) {
        let SUCCESS_MESSAGE = "Successfully added feeds to Database";
        let couchClient = await CouchClient.createInstance(this.accesstoken);
        let feedObject = { "docs": feeds };
        //console.log(feedObject);
        await couchClient.saveBulkDocuments(feedObject);
        return SUCCESS_MESSAGE;

    }
}
