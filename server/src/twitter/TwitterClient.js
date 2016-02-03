"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import Logger from "../logging/Logger.js";
import AdminDbClient from "../db/AdminDbClient";
import TwitterLogin from "./TwitterLogin";

export const searchApi = "/search/tweets.json", searchParams = "filter:retweets", FEEDS_COUNT = 100;
export default class TwitterClient {

    static logger() {
        return Logger.instance();
    }
    static instance() {
        return new TwitterClient();
    }
    constructor() {
    }

    fetchTweets(url, userName, timestamp) {
        let timestampQuery = timestamp ? "&since:" + encodeURIComponent(this._getTwitterTimestampFormat(timestamp)) : "";

        return new Promise((resolve, reject) => {
            this.getAccessTokenAndSecret(userName).then((tokenInfo) => {
                let [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
                let oauth = TwitterLogin.createOAuthInstance();
                let searchUrl = `${this._baseUrl()}${searchApi}?q=${encodeURIComponent(url)}${timestampQuery}&count=${encodeURIComponent(FEEDS_COUNT+searchParams)}`;
                oauth.get(searchUrl, oauthAccessToken, oauthAccessTokenSecret, (error, data) => {
                    if(error) {
                        reject(error);
                    }
                    resolve(JSON.parse(data));
                });
            }).catch(error => {
                reject(error);
            });
        });
    }

    getAccessTokenAndSecret(userName) {
        return new Promise((resolve, reject) => {
            let tokenDocumentId = userName + "_twitterToken";
            AdminDbClient.instance().getDb().then((dbInstance) => {
                dbInstance.getDocument(tokenDocumentId).then((fetchedDocument) => { //eslint-disable-line max-nested-callbacks
                    resolve([fetchedDocument.oauthAccessToken, fetchedDocument.oauthAccessTokenSecret]);
                }).catch(() => { //eslint-disable-line max-nested-callbacks
                    reject("Not authenticated with twitter");
                });
            });
        });
    }

    //fetchTweetsOld(url, userName, timestamp) {
    //    return new Promise((resolve, reject) => {
    //        let timestampQuery = timestamp ? "&since:" + this._getTwitterTimestampFormat(timestamp) : "";
    //        let options = {
    //            "uri": this._baseUrl() + searchApi, "qs": { "q": url + timestampQuery, "count": FEEDS_COUNT + searchParams }, "json": true,
    //            "headers": {
    //                "Authorization": this.bearerToken
    //            },
    //            "timeout": this._timeOut()
    //        };
    //        request.get(options, (error, response, body) => {
    //            if(NodeErrorHandler.noError(error)) {
    //                if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK) && response.body.statuses.length > 0) {
    //                    resolve(body);
    //                } else {
    //                    TwitterClient.logger().warn("%s is not a valid twitter handler", url, error);
    //                    reject({ "message": url + " is not a valid twitter handler" });
    //                }
    //            } else {
    //                TwitterClient.logger().warn("Request failed for twitter handler %s", url, error);
    //                reject({ "message": "Request failed for twitter handler " + url });
    //            }
    //        });
    //    });
    //}

    _baseUrl() {
        return ApplicationConfig.instance().twitter().url;
    }

    _timeOut() {
        return ApplicationConfig.instance().twitter().timeOut;
    }

    _getTwitterTimestampFormat(timestamp) {
        let dateObj = new Date(timestamp);
        return dateObj.getFullYear() + "-" + dateObj.getMonth() + 1 + "-" + dateObj.getDate();
    }
}
