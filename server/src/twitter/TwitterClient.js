"use strict";
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

    fetchTweets(url, userName, timestamp) {
        let timestampQuery = timestamp ? encodeURIComponent(" since:") + this._getTwitterTimestampFormat(timestamp) : "";

        return new Promise((resolve, reject) => {
            this.getAccessTokenAndSecret(userName).then((tokenInfo) => {
                let [oauthAccessToken, oauthAccessTokenSecret] = tokenInfo;
                let oauth = TwitterLogin.createOAuthInstance();
                let searchUrl = `${this._baseUrl()}${searchApi}?q=${encodeURIComponent(url)}${timestampQuery}&count=${encodeURIComponent(FEEDS_COUNT + searchParams)}`;
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
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then((dbInstance) => {
                dbInstance.getDocument(tokenDocumentId).then((fetchedDocument) => { //eslint-disable-line max-nested-callbacks
                    resolve([fetchedDocument.oauthAccessToken, fetchedDocument.oauthAccessTokenSecret]);
                }).catch(() => { //eslint-disable-line max-nested-callbacks
                    reject("Not authenticated with twitter");
                });
            });
        });
    }

    _baseUrl() {
        return ApplicationConfig.instance().twitter().url;
    }

    _getTwitterTimestampFormat(timestamp) {
        let dateObj = new Date(timestamp);
        return dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
    }
}
