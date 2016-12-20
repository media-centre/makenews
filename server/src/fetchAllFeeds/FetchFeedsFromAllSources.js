import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import StringUtil from "../../../common/src/util/StringUtil";
import Logger from "../logging/Logger";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";

export const RSS_TYPE = "rss";
export const FACEBOOK_TYPE = "facebook";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources {
    constructor(request, response) {
        this.response = response;
        this.accesstoken = request.cookies.AuthSession;
        this.urlDocuments = request.body.data;
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
            let ZERO = 0;
            let urlDocuments = this.urlDocuments.length === ZERO ? this._getUrlDocuments() : this.urlDocuments;
            urlDocuments.forEach((item, index)=> {
                this.fetchFeedsFromSource(item).then((feeds)=> {
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
        return response.docs;
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
                feeds = await FacebookRequestHandler.instance(this._getFacebookAccessToken()).pagePosts(item._id);
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

    async _getFacebookAccessToken() {
        try{
            let couchClient = await CouchClient.createInstance(this.accesstoken);
            let userName = await couchClient.getUserName();
            const adminDetails = ApplicationConfig.instance().adminDetails();
            let dbInstance = await AdminDbClient.instance(adminDetails.couchDbAdmin.username, adminDetails.couchDbAdmin.password, adminDetails.db);
            let selector = {
                "selector": {
                    "_id": {
                        "$eq": userName + "_facebookToken"
                    }
                }
            };
            let response = await dbInstance.findDocuments(selector);
            let ZeroIndex = 0;
            return response.docs[ZeroIndex];
        } catch(error) {
            throw error;
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
