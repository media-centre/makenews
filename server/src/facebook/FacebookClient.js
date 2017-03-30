import StringUtil from "../../../common/src/util/StringUtil";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import request from "request";
import fetch from "isomorphic-fetch";
import NodeErrorHandler from "../NodeErrorHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import { constructQueryString } from "../../../common/src/util/HttpRequestUtil";
import { maxFeedsPerRequest } from "./../util/Constants";
import Logger from "../logging/Logger";
import R from "ramda"; //eslint-disable-line id-length
import { parseFacebookPosts } from "./FacebookFeedParser.js";
import DateUtil from "./../util/DateUtil";

export default class FacebookClient {

    static instance(accessToken, appSecretProof, appId) {
        return new FacebookClient(accessToken, appSecretProof, appId);
    }

    static logger() {
        return Logger.instance("Facebook");
    }

    constructor(accessToken, appSecretProof, appId) {
        if (StringUtil.isEmptyString(accessToken) || StringUtil.isEmptyString(appSecretProof)) {
            throw new Error("access token or application secret proof can not be null");
        }
        this.accessToken = accessToken;
        this.appSecretProof = appSecretProof;
        this.appId = appId;
        this.facebookParameters = ApplicationConfig.instance().facebook();
    }

    async fetchFeeds(sourceId, type, parameters = {}) {
        if (StringUtil.isEmptyString(sourceId)) {
            const errorInfo = {
                "message": "page id cannot be empty",
                "type": "InvalidArgument"
            };
            throw errorInfo;
        } else {
            this._addDefaultParameters(parameters);
            const url = `${this.facebookParameters.url}/${sourceId}/${type}?${constructQueryString(parameters, false)}`;
            let feedResponse = await this.requestForFeeds(url);
            if(feedResponse.error) {
                FacebookClient.logger().error(`FacebookClient:: error fetch feeds for url ${sourceId}. Details:: ${feedResponse.error}`);
                delete feedResponse.error;
            }
            try {
                feedResponse.docs = parseFacebookPosts(sourceId, feedResponse.docs);
                return feedResponse;
            } catch (err) {
                FacebookClient.logger().error("FacebookClient:: error parsing feeds for url %s. Error %s", sourceId, JSON.stringify(err));
                throw err;
            }
        }
    }

    async requestForFeeds(url, since, feeds = []) {
        let feedsData = { "docs": feeds, "paging": {} };
        try {
            const response = await fetch(url, { "timeout": this.facebookParameters.timeOut });
            if (response.status === HttpResponseHandler.codes.OK) {
                const feedResponse = await response.json();
                const feedsAccumulator = feeds.concat(feedResponse.data);
                if(!since && feedResponse.paging) { //eslint-disable-next-line no-param-reassign
                    since = this._getLatestFeedTimeStamp(feedResponse.paging.previous);
                }
                if(feedResponse.data.length === maxFeedsPerRequest.facebook && feedsAccumulator.length < this.facebookParameters.maxFeeds) {
                    return await this.requestForFeeds(feedResponse.paging.next, since, feedsAccumulator);
                }
                feedsData.docs = feedsAccumulator;
            } else {
                feedsData.error = (await response.json()).error.message;
            }
        } catch (err) {
            feedsData.error = "Error occurred while fetching feeds";
        }
        feedsData.paging.since = since ? since : DateUtil.getCurrentTimeInSeconds();
        return feedsData;

    }

    fetchProfiles(parameters = { "fields": "id,name,picture", "limit": 100 }) {
        return new Promise((resolve, reject) => {
            this._addDefaultParameters(parameters);
            request.get({
                "url": `${this.facebookParameters.url}/me/taggable_friends?${constructQueryString(parameters, false)}`
            }, (error, response, body) => {
                let err = NodeErrorHandler.noError(error);
                if (err) {
                    if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        let profiles = JSON.parse(body);
                        FacebookClient.logger().debug("FacebookClient:: successfully fetched the profiles");
                        resolve(profiles);
                    } else {
                        let errorInfo = JSON.parse(body);
                        FacebookClient.logger().error(`FacebookClient:: Error fetching profiles. Error: ${JSON.stringify(errorInfo)}`);
                        reject(errorInfo.error);
                    }
                } else {
                    FacebookClient.logger().error(`FacebookClient:: Error fetching profiles. Error ${JSON.stringify(error)}`);
                    reject(error);
                }
            });
        });
    }

    async fetchSourceUrls(parameters, paging = {}) {
        parameters.fields = "id,name,picture";
        let params = R.merge(parameters, paging);
        this._addDefaultParameters(params);
        let response = null;
        try {
            response = await fetch(`${this.facebookParameters.url}/search?${constructQueryString(params, false)}`);
        } catch(err) {
            FacebookClient.logger().error(`FacebookClient:: Error fetching ${parameters.type}s for ${parameters.q}. Error ${err}`);
            throw err;
        }

        let responseJson = await response.json();
        if(response.status === HttpResponseHandler.codes.OK) {
            return responseJson;
        }
        FacebookClient.logger().debug(`FacebookClient:: Failed to fetch the ${parameters.type}s for ${parameters.q}`);
        throw responseJson;
    }

    async getFacebookPageInfo(facebookPageUrl) {
        let response = null;
        try {
            response = await fetch(this.facebookParameters.url + "/" + facebookPageUrl + "/?access_token=" + this.accessToken + "&appsecret_proof=" + this.appSecretProof, {
                "timeout": this.facebookParameters.timeOut
            });
        } catch (err) {
            throw `Timeout fetching facebookId for ${facebookPageUrl}`; //eslint-disable-line no-throw-literal
        }

        if (response.status === HttpResponseHandler.codes.OK) {
            const responseJSON = await response.json();
            if(responseJSON.og_object) {
                throw `Unable to get the facebookId for ${facebookPageUrl}`; //eslint-disable-line no-throw-literal
            }
            FacebookClient.logger().debug("FacebookClient:: successfully fetched facebook id '%s' for url %s.", responseJSON.id, facebookPageUrl);
            return responseJSON;
        }
        const errorInfo = response.json();
        FacebookClient.logger().error("FacebookClient:: error fetching facebook id for url %s. Error %s", facebookPageUrl, JSON.stringify(errorInfo));
        throw errorInfo.error;
    }

    getLongLivedToken() {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
            request.get({
                "url": `${this.facebookParameters.url}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.appSecretProof}&fb_exchange_token=${this.accessToken}`,
                "timeout": this.facebookParameters.timeOut
            }, (error, response, body) => { //eslint-disable-line no-unused-vars
                if (NodeErrorHandler.noError(error)) {
                    if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        let feedResponse = JSON.parse(body);
                        FacebookClient.logger().debug("FacebookClient:: getting long lived token successful.");
                        resolve(feedResponse);
                    } else {
                        let errorInfo = JSON.parse(body);
                        FacebookClient.logger().debug("FacebookClient:: error getting long lived token failed. Error: %j", errorInfo.error);
                        reject(errorInfo.error);
                    }
                } else {
                    FacebookClient.logger().error("FacebookClient:: error while getting long lived token. Error: %s.", JSON.stringify(error));
                    reject(error);
                }
            });
        });
    }

    _addDefaultParameters(receivedParameters) {
        receivedParameters.access_token = this.accessToken; //eslint-disable-line camelcase
        receivedParameters.appsecret_proof = this.appSecretProof; //eslint-disable-line camelcase
    }

    _getLatestFeedTimeStamp(paging) {
        return parseInt(paging.split("since=")[1].split("&")[0], 10); //eslint-disable-line no-magic-numbers
    }
}
