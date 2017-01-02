import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import Logger from "../logging/Logger";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import Route from "../routes/helpers/Route";

export const RSS_TYPE = "rss";
export const FACEBOOK_PAGE = "fb_page";
export const FACEBOOK_GROUP = "fb_group";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accesstoken = request.cookies.AuthSession;
        this.facebookAcessToken = null;
    }

    static logger() {
        return Logger.instance();
    }

    fetchFeeds() {
        if (this.accesstoken) {
            this.fetchFeedsFromAllSources().then((response)=> {
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds.");
                this._handleSuccess(response);

            }).catch((err) => {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
                this._handleBadRequest();
            });
        } else {
            FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: Authentication failed");
            this._handleBadRequest();
        }
    }

    async fetchFeedsFromAllSources() {
        let urlDocuments = await this._getUrlDocuments();
        let mapUrlDocs = urlDocuments.map(async (url) => await this.fetchFeedsFromSource(url));
        let feedArrays = await Promise.all(mapUrlDocs);
        let feeds = feedArrays.reduce((acc, feedsArray) => acc.concat(feedsArray), []);
        return await this.saveFeedDocumentsToDb(feeds);
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
                FetchFeedsFromAllSources.logger().debug(`FetchFeedsFromAllSources:: successfully fetched rss feeds from:: ${item._id}`);
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error(`FetchFeedsFromAllSources:: error fetching rss feeds. Error: ${JSON.stringify(err)}`);
                return [];
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
                return [];
            }
        case TWITTER_TYPE:
            try {
                feeds = await TwitterRequestHandler.instance().fetchTweetsRequest(item._id);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched twitter feeds from all sources.");
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching twitter feeds. Error: %s", err);
                return [];
            }
        default:
            return [];
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

    async saveFeedDocumentsToDb(feeds) {
        let couchClient = await CouchClient.createInstance(this.accesstoken);
        let feedObject = { "docs": feeds };
        return await couchClient.saveBulkDocuments(feedObject);
    }
}
