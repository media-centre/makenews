"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import HttpRequestUtil from "../../../common/src/util/HttpRequestUtil.js";
import Logger from "../logging/Logger";

export default class FacebookClient {

    static instance(accessToken, appSecretProof, appId) {
        return new FacebookClient(accessToken, appSecretProof, appId);
    }

    static logger() {
        return Logger.instance();
    }

    constructor(accessToken, appSecretProof, appId) {
        if(StringUtil.isEmptyString(accessToken) || StringUtil.isEmptyString(appSecretProof)) {
            throw new Error("access token or application secret proof can not be null");
        }
        this.accessToken = accessToken;
        this.appSecretProof = appSecretProof;
        this.appId = appId;
        this.facebookParameters = ApplicationConfig.instance().facebook();
    }

    //didn't find any call stack for this
    pageNavigationFeeds(pageUrl) {
        return new Promise((resolve, reject) => {
            let parameters = {};
            this._addDefaultParameters(parameters);
            request.get({
                "url": pageUrl + "&" + new HttpRequestUtil().queryString(parameters, false),
                "timeout": this.facebookParameters.timeOut
            }, (error, response, body) => {
                if (NodeErrorHandler.noError(error)) {
                    if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        let feedResponse = JSON.parse(body);
                        FacebookClient.logger().debug("FacebookClient:: successfully fetched feeds for url %s.", pageUrl);
                        resolve(feedResponse);
                    } else {
                        let errorInfo = JSON.parse(body);
                        FacebookClient.logger().error("FacebookClient:: error fetching feeds for url %s. Error %s", pageUrl, JSON.stringify(errorInfo));
                        reject(errorInfo.error);
                    }
                } else {
                    FacebookClient.logger().error("FacebookClient:: error fetching feeds for url %s. Error %s.", pageUrl, JSON.stringify(error));
                    reject(error);
                }
            });

        });
    }

    pagePosts(pageId, parameters = {}) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(pageId)) {
                reject({
                    "message": "page id cannot be empty",
                    "type": "InvalidArgument"
                });
            } else {
                this._addDefaultParameters(parameters);
                request.get({
                    "url": this.facebookParameters.url + "/" + pageId + "/posts?" + new HttpRequestUtil().queryString(parameters, false),
                    "timeout": this.facebookParameters.timeOut
                }, (error, response, body) => {
                    if (NodeErrorHandler.noError(error)) {
                        if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                            let feedResponse = JSON.parse(body);
                            FacebookClient.logger().debug("FacebookClient:: successfully fetched feeds for url %s.", pageId);
                            resolve(feedResponse);
                        } else {
                            let errorInfo = JSON.parse(body);
                            FacebookClient.logger().error("FacebookClient:: error fetching feeds for url %s. Error %s", pageId, JSON.stringify(errorInfo));
                            reject(errorInfo.error);
                        }
                    } else {
                        FacebookClient.logger().error("FacebookClient:: error fetching feeds for url %s. Error %s.", pageId, JSON.stringify(error));
                        reject(error);
                    }
                });
            }
        });
    }

    getFacebookId(facebookPageUrl) {
        return new Promise((resolve, reject) => { //eslint-disable-line no-unused-vars
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
                "url": this.facebookParameters.url + "/oauth/access_token?grant_type=fb_exchange_token&client_id=" + this.appId + "&client_secret=" + this.appSecretProof + "&fb_exchange_token=" + this.accessToken,
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
        receivedParameters.access_token = this.accessToken; //eslint-disable-line
        receivedParameters.appsecret_proof = this.appSecretProof; //eslint-disable-line
    }
}
