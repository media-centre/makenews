import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import StringUtil from "../../../common/src/util/StringUtil";
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
        this.request = request;
        this.response = response;
        this.accesstoken = request.cookies.AuthSession;
        this.facebookAcessToken = null;
        //this.urlDocuments = request.body.data;
        console.log(1);
        console.log("In fetch feeds");
        console.log(this.accesstoken);
    }

    static logger() {
        return Logger.instance();
    }

    fetchFeeds() {
        return new Promise((resolve, reject)=> {
            console.log("Before If COndition");
            if (this.isValidateRequestData()) {
                console.log("In If Condition");
                this.fetchFeedsFromAllSources().then((feeds)=> {

                    FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched feeds.");
                    console.log(feeds)
                    resolve(feeds);

                }).catch((err) => {
                    console.log(4);
                    console.log("in fetch feeds error")
                    console.log(err)
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

        case FACEBOOK_GROUP: type = "feed";
        case FACEBOOK_PAGE: //eslint-disable-line no-fallthrough
            try {

                if(!this.facebookAcessToken) {
                    console.log("In If condition for facebook Access Token")
                    this.facebookAcessToken = await this._getFacebookAccessToken();
                    console.log(this.facebookAcessToken)
                }
                console.log("In Facebook Type")
                console.log(this.facebookAcessToken);
                console.log(10);
                console.log("access token");
                feeds = await FacebookRequestHandler.instance(this.facebookAcessToken).pagePosts(item._id, type);

                FetchFeedsFromAllSources.logger().debug("FetchFeedsFromAllSources:: successfully fetched facebook feeds from all sources.");
                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^")
                console.log(feeds);
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
            console.log("sddlskjdskljdlksd hello world")
            let couchClient = await CouchClient.createInstance(this.accesstoken);
            console.log("After coucclient instance");
            let userName = await couchClient.getUserName();
            console.log("username", userName);
            const adminDetails = ApplicationConfig.instance().adminDetails();
            let dbInstance = await AdminDbClient.instance(adminDetails.couchDbAdmin.username, adminDetails.couchDbAdmin.password, adminDetails.db);
            let selector = {
                "selector": {
                    "_id": {
                        "$eq": userName + "_facebookToken"
                    }
                }
            };
            console.log("before db respnse");
            let response = await dbInstance.findDocuments(selector);
            //console.log(response);
            let ZeroIndex = 0;
            console.log("in facebook find documents ==> ")
            return response.docs[ZeroIndex].access_token;

        } catch(error) {
            console.log("in find fb documents")
            console.log(error)
            throw error;
        }


    }

    isValidateRequestData() {
        if (!this.accesstoken) {  // eslint-disable-line no-magic-numbers
            return false;
        }
        let errorItems = this.request.body.data.filter((item) => {                                      //eslint-disable-line consistent-return
            if (StringUtil.isEmptyString(item.sourceType) || StringUtil.isEmptyString(item._id)) {
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
