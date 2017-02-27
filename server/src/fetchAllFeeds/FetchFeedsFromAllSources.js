import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import Logger from "../logging/Logger";
import CouchClient from "./../../src/CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";
import Route from "./../routes/helpers/Route";
import { userDetails } from "./../Factory";
import DateUtil from "./../util/DateUtil";
import { fetchFeedsTimeInterval } from "./../util/Constants";

export const WEB = "web";
export const FACEBOOK_PAGE = "fb_page";
export const FACEBOOK_GROUP = "fb_group";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.accesstoken = request.cookies.AuthSession;
        this.facebookAcessToken = null;
        this.DOCSLIMIT = 25;
    }

    static logger() {
        return Logger.instance();
    }

    async fetchFeeds() {
        try {
            const feeds = await this.fetchFeedsFromAllSources();
            let response = { "status": false, "message": "No new feeds" };
            if(feeds.length) {
                await this.saveFeedDocumentsToDb(feeds);
                response = { "status": true };
            }
            FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds.");
            this._handleSuccess(response);
        } catch(err) {
            FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: %s", err);
            this._handleBadRequest();
        }
    }

    async fetchFeedsFromAllSources() {
        const couchClient = CouchClient.instance(this.accesstoken);
        let urlDocuments = await this._getUrlDocuments(couchClient);
        let mapUrlDocs = urlDocuments.map(async (url) => {
            const currentTime = DateUtil.getCurrentTimeInSeconds();
            if(!url.since ||
                currentTime - url.since > fetchFeedsTimeInterval[url.sourceType]) {
                let feeds = await this.fetchFeedsFromSource(url);
                /* TODO: URLTimeStamp should be updated, only after we save the feeds in DB*/ //eslint-disable-line
                await this.updateUrlTimeStamp(url, feeds.paging);
                return feeds.docs;
            }
            return [];
        });
        let feedArrays = await Promise.all(mapUrlDocs);
        return feedArrays.reduce((acc, feedsObjArray) => acc.concat(feedsObjArray));
    }
    /* TODO: change DOCSLIMIT to 100 and add limit to selector*/ //eslint-disable-line 
    async _getUrlDocuments(couchClient, offset = 0, results = []) { // eslint-disable-line no-magic-numbers
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            },
            "skip": offset
        };
        const response = await couchClient.findDocuments(selector);

        if(response.docs.length === this.DOCSLIMIT) {
            return await this._getUrlDocuments(couchClient, offset + this.DOCSLIMIT, results.concat(response.docs));
        }
        return results.concat(response.docs);
    }

    async updateUrlTimeStamp(sourceUrlDoc, paging) {
        try {
            let couchClient = CouchClient.instance(this.accesstoken);
            const updatedSource = Object.assign({}, sourceUrlDoc, paging);
            await couchClient.saveDocument(encodeURIComponent(sourceUrlDoc._id), updatedSource);
        } catch (err) {
            FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error updating source url timestamp. Error: %s", err);
        }
    }

    async fetchFeedsFromSource(item) {
        let feeds = null, type = "posts";
        let defaultResponse = { "docs": [] };
        switch (item.sourceType) {
        case WEB:
            try {
                feeds = await RssRequestHandler.instance().fetchBatchRssFeedsRequest(item._id);
                FetchFeedsFromAllSources.logger().debug(`FetchFeedsFromAllSources:: successfully fetched rss feeds from:: ${item._id}`);
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error(`FetchFeedsFromAllSources:: error fetching rss feeds. Error: ${JSON.stringify(err)}`);
                return defaultResponse;
            }
        case FACEBOOK_GROUP:
            type = "feed";
        case FACEBOOK_PAGE: //eslint-disable-line no-fallthrough
            try {
                if (!this.facebookAcessToken) {
                    this.facebookAcessToken = await this._getFacebookAccessToken();
                }
                //eslint-disable-next-line no-magic-numbers
                feeds = await FacebookRequestHandler.instance(this.facebookAcessToken).fetchFeeds(item._id, type, { "since": item.since || 0 });
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched facebook feeds from all sources.");
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching facebook feeds. Error: %s", err);
                return defaultResponse;
            }
        case TWITTER_TYPE:
            try {
                feeds = await TwitterRequestHandler.instance().fetchTweetsRequest(item._id, item.since, this.accesstoken, item.sinceId);
                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched twitter feeds from all sources.");
                return feeds;
            } catch (err) {
                FetchFeedsFromAllSources.logger().error(`FetchFeedsFromAllSources:: error fetching twitter feeds. Error: ${JSON.stringify(err)}`);
                return defaultResponse;
            }
        default:
            return defaultResponse;
        }
    }

    async _getFacebookAccessToken() {
        let { userName } = userDetails.getUser(this.accesstoken);
        const adminDetails = ApplicationConfig.instance().adminDetails();
        let dbInstance = await AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db);
        let selector = {
            "selector": {
                "_id": {
                    "$eq": userName + "_facebookToken"
                }
            }
        };
        let response = await dbInstance.findDocuments(selector);
        const [tokenDoc] = response.docs;
        return tokenDoc.access_token;
    }

    async saveFeedDocumentsToDb(feeds) {
        let couchClient = CouchClient.instance(this.accesstoken);
        let feedObject = { "docs": feeds };
        return await couchClient.saveBulkDocuments(feedObject);
    }
}
