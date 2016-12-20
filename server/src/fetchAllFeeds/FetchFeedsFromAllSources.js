import RssRequestHandler from "../rss/RssRequestHandler";
import FacebookRequestHandler from "../facebook/FacebookRequestHandler";
import TwitterRequestHandler from "../twitter/TwitterRequestHandler";
import StringUtil from "../../../common/src/util/StringUtil";
import Logger from "../logging/Logger";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import AdminDbClient from "../db/AdminDbClient";

export const RSS_TYPE = "rss";
export const FACEBOOK_TYPE = "fb_page";
export const TWITTER_TYPE = "twitter";

export default class FetchFeedsFromAllSources {
    constructor(request, response) {
        this.response = response;
        this.accesstoken = request.cookies.AuthSession;
        this.facebookAcessToken = null;
        //this.urlDocuments = request.body.data;
        console.log(1);
        console.log("In fetch feeds");
        console.log(this.accesstoken);
        console.log(request.body);
    }

    static logger() {
        return Logger.instance();
    }

    fetchFeeds() {
        return new Promise((resolve, reject)=> {

            console.log("Before If COndition");
            //if (this.isValidateRequestData()) {
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
            //} else {
            //    console.log(5);
            //
            //    FetchFeedsFromAllSources.logger().error("FetchFeedsFromAllSources:: error fetching feeds. Error: Invalid url data.");
            //    reject({ "error": "Invalid url data" });
            //}
        });
    }

    fetchFeedsFromAllSources() {
        return new Promise((resolve, reject)=> {
            let ZERO = 0;
            this._getUrlDocuments().then((urlDocuments) => {
                console.log(urlDocuments);
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
                if(!this.facebookAcessToken) {
                    console.log("In If condition for facebook Access Token")
                    this.facebookAcessToken = await this._getFacebookAccessToken();
                    console.log(this.facebookAcessToken)
                }
                console.log("In Facebook Type")
                console.log(this.facebookAcessToken);
                console.log(10);
                console.log("access token");
                feeds = await FacebookRequestHandler.instance(this.facebookAcessToken).pagePosts(item._id);

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
            let couchClient = await CouchClient.createInstance(this.accesstoken);
            console.log("after couch clinet instance");
            let userName = await couchClient.getUserName();
            console.log("username", userName)
            const adminDetails = ApplicationConfig.instance().adminDetails();
            console.log("after admin details")
            console.log(adminDetails.couchDbAdmin.username)
            console.log(adminDetails.couchDbAdmin.password)
            console.log(adminDetails.db)
            let dbInstance = await AdminDbClient.instance(adminDetails.couchDbAdmin.username, adminDetails.couchDbAdmin.password, adminDetails.db);
            console.log("after admin db client instance")
=
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
            return response.docs[ZeroIndex];

        } catch(error) {
            console.log("in find fb documents")
            console.log(error)
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
