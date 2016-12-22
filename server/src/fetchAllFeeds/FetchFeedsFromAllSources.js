import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import Logger from "../logging/Logger";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";

export const RSS_TYPE = "rss";
export const FACEBOOK_PAGE = "fb_page";
export const FACEBOOK_GROUP = "fb_group";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources {
    constructor(request, response) {
        this.response = response;
        this.accesstoken = request.cookies.AuthSession;
        this.facebookAcessToken = null;
    }

    static logger() {
        return Logger.instance();
    }

    fetchFeeds() {
        return new Promise((resolve, reject)=> {
            if (this.isValidateRequestData()) {
                this.fetchFeedsFromAllSources().then((feeds)=> {
                    FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds.");
                    resolve(feeds);

                }).catch((err) => {
                    FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
                    reject(err);
                });
            } else {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: Invalid url data.");
                reject({ "error": "Invalid url data" });
            }
        });
    }

    fetchFeedsFromAllSources() {
        return new Promise((resolve, reject)=> {
            this._getUrlDocuments().then((urlDocuments) => {
                urlDocuments.forEach((item, index)=> {
                    this.fetchFeedsFromSource(item).then((feeds)=> {
                        this.saveFeedDocumentsToDb(feeds).then(response => {
                            resolve(response);
                        }).catch(error => {
                            reject(error);
                        });
                        if (urlDocuments.length - 1 === index) {  // eslint-disable-line no-magic-numbers
                            FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds from all sources.");
                        }
                    }).catch((err) => {
                        FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
                        reject(err);

                    });
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
        let feeds = null; let type = "posts";
        let emptyObject = [];
        switch (item.sourceType) {
        case RSS_TYPE:
            try {
                feeds = await RssRequestHandler.instance().fetchBatchRssFeedsRequest(item._id);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched rss feeds from all sources.");
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching rss feeds. Error: %s", err);
                throw(err);
            }
        case FACEBOOK_GROUP: type = "feed";
        case FACEBOOK_PAGE: //eslint-disable-line no-fallthrough
            try {
                if(!this.facebookAcessToken) {
                    this.facebookAcessToken = await this._getFacebookAccessToken();
                }
                feeds = await FacebookRequestHandler.instance(this.facebookAcessToken).pagePosts(item._id, type);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched facebook feeds from all sources.");
                return feeds;
            } catch (err) {
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
            throw(emptyObject);
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
            return response.docs[ZeroIndex].access_token;

        } catch(error) {
            throw error;
        }


    }

    isValidateRequestData() {
        if (!this.accesstoken) {
            return false;
        }
        return true;
        // let errorItems = this.request.body.data.filter((item) => {
        //     if (StringUtil.isEmptyString(item.sourceType) || StringUtil.isEmptyString(item._id)) {
        //         return item;
        //     }
        // });
        // return errorItems.length <= 0;
    }

    async saveFeedDocumentsToDb(feeds) {
        let SUCCESS_MESSAGE = "Successfully added feeds to Database";
        let couchClient = await CouchClient.createInstance(this.accesstoken);
        let feedObject = { "docs": feeds };
        await couchClient.saveBulkDocuments(feedObject);
        return SUCCESS_MESSAGE;

    }
}
