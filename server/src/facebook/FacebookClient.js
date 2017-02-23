import StringUtil from "../../../common/src/util/StringUtil";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import request from "request";
import fetch from "isomorphic-fetch";
import NodeErrorHandler from "../NodeErrorHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import { constructQueryString } from "../../../common/src/util/HttpRequestUtil";
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

    async fetchFeeds(pageId, type, parameters = {}) {
        if (StringUtil.isEmptyString(pageId)) {
            const errorInfo = {
                "message": "page id cannot be empty",
                "type": "InvalidArgument"
            };
            throw errorInfo;
        } else {
            this._addDefaultParameters(parameters);
            const url = `${this.facebookParameters.url}/${pageId}/${type}?${constructQueryString(parameters, false)}`;
            try {
                let feedResponse = await this.requestForFeeds(url);
                feedResponse.docs = parseFacebookPosts(pageId, feedResponse.docs);
                return feedResponse;
            } catch (err) {
                FacebookClient.logger().error("FacebookClient:: error fetching feeds for url %s. Error %s", pageId, JSON.stringify(err));
                throw err;
            }
        }
    }

    async requestForFeeds(url) {
        const response = await fetch(url, { "timeout": this.facebookParameters.timeOut });
        if (response.status === HttpResponseHandler.codes.OK) {
            let feedResponse = await response.json();
            let since = feedResponse.paging ? this._getLatestFeedTimeStamp(feedResponse.paging.previous) : DateUtil.getCurrentTime();
            return { "docs": feedResponse.data, "paging": { since } };
        }
        let errorInfo = await response.json();
        throw errorInfo.error;
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
        throw responseJson.error;
    }

    getFacebookId(facebookPageUrl) {
        return new Promise((resolve, reject) => {
            request.get({
                "url": this.facebookParameters.url + "/" + facebookPageUrl + "/?access_token=" + this.accessToken + "&appsecret_proof=" + this.appSecretProof,
                "timeout": this.facebookParameters.timeOut
            }, (error, response, body) => { //eslint-disable-line no-unused-vars
                if (NodeErrorHandler.noError(error)) {
                    if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        const facebookId = JSON.parse(response.body).id;
                        FacebookClient.logger().debug("FacebookClient:: successfully fetched facebook id '%s' for url %s.", facebookId, facebookPageUrl);
                        resolve(facebookId);
                    } else {
                        let errorInfo = JSON.parse(body);
                        FacebookClient.logger().error("FacebookClient:: error fetching facebook id for url %s. Error %s", facebookPageUrl, JSON.stringify(errorInfo));
                        reject(errorInfo.error);
                    }
                } else {
                    FacebookClient.logger().error("FacebookClient:: error fetching facebook id for url %s. Error: %s", facebookPageUrl, JSON.stringify(error));
                    reject(error);
                }
            });
        });
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
