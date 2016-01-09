"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import HttpRequestUtil from "../../../common/src/util/HttpRequestUtil.js";

export default class FacebookClient {

    static instance(accessToken, appSecretProof) {
        return new FacebookClient(accessToken, appSecretProof);
    }
    constructor(accessToken, appSecretProof) {
        if(StringUtil.isEmptyString(accessToken) || StringUtil.isEmptyString(appSecretProof)) {
            throw new Error("access token or application secret proof can not be null");
        }
        this.accessToken = accessToken;
        this.appSecretProof = appSecretProof;
        this.facebookParameters = ApplicationConfig.instance().facebook();
    }

    pageNavigationFeeds(pageUrl) {
        return new Promise((resolve, reject) => {
            let parameters = {};
            this._addDefaultParameters(parameters);
            request.get({
                "url": pageUrl + "&" + new HttpRequestUtil().queryString(parameters, false),
                "timeout": this.facebookParameters.timeOutInSeconds
            }, (error, response, body) => {
                if (NodeErrorHandler.noError(error)) {
                    if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        let feedResponse = JSON.parse(body);
                        resolve(feedResponse);
                    } else {
                        let errorInfo = JSON.parse(body);
                        reject(errorInfo.error);
                    }
                } else {
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
                    "timeout": this.facebookParameters.timeOutInSeconds
                }, (error, response, body) => {
                    if (NodeErrorHandler.noError(error)) {
                        if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                            let feedResponse = JSON.parse(body);
                            resolve(feedResponse);
                        } else {
                            let errorInfo = JSON.parse(body);
                            reject(errorInfo.error);
                        }
                    } else {
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
                "timeout": this.facebookParameters.timeOutInSeconds
            }, (error, response, body) => { //eslint-disable-line no-unused-vars
                if (NodeErrorHandler.noError(error)) {
                    resolve(JSON.parse(response.body).id);
                } else {
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
