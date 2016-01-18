"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import FacebookClient from "./FacebookClient.js";
import CryptUtil from "../../src/util/CryptUtil.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";

export default class FacebookRequestHandler {

    static instance(accessToken) {
        return new FacebookRequestHandler(accessToken);
    }

    static logger() {
        return Logger.instance();
    }

    constructor(accessToken) {
        if(StringUtil.isEmptyString(accessToken)) {
            throw new Error("access token can not be empty");
        }
        this.accessToken = accessToken;
    }

    pagePosts(webUrl, options = {}) {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = this.facebookClient();
            facebookClientInstance.getFacebookId(webUrl).then(pageId => {
                facebookClientInstance.pagePosts(pageId, this._getAllOptions(options)).then(feeds => {
                    FacebookRequestHandler.logger().debug("PagePosts response: %s", feeds);
                    resolve(feeds.data);
                }).catch(error => {
                    FacebookRequestHandler.logger().error("error fetching facebook feeds of web url = %s. Error: %s", webUrl, error);
                    reject("error fetching facebook feeds of web url = " + webUrl);
                });
            }).catch(error => {
                FacebookRequestHandler.logger().error("error fetching facebook id of web url = %s. Error: %s", webUrl, error);
                reject("error fetching facebook id of web url = " + webUrl);
            });
        });
    }

    saveToken(dbInstance, document, resolve, reject) {
        dbInstance.saveDocument("facebookToken", document).then(() => {
            resolve(document.expired_after);
        }).catch(error => {
            FacebookRequestHandler.logger().error("error while saving facebook long lived token with error %s", error);
            reject("error while saving facebook long lived token.");
        });
    }

    static getCurrentTime() {
        return new Date().getTime();
    }

    setToken() {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = FacebookClient.instance(this.accessToken, this.appSecretKey(), this.appId());
            let currentTime = FacebookRequestHandler.getCurrentTime();
            facebookClientInstance.getLongLivedToken().then(response => {
                response.expired_after = currentTime + response.expires_in; //eslint-disable-line camelcase
                FacebookRequestHandler.logger().debug("getLongLivedToken response: %s", response);
                AdminDbClient.instance().getDb().then((dbInstance) => {
                    dbInstance.getDocument("facebookToken").then((document) => { //eslint-disable-line max-nested-callbacks
                        document.access_token = response.access_token; //eslint-disable-line camelcase
                        document.token_type = response.token_type; //eslint-disable-line camelcase
                        document.expires_in = response.expires_in; //eslint-disable-line camelcase
                        document.expired_after = response.expired_after; //eslint-disable-line camelcase
                        this.saveToken(dbInstance, document, resolve, reject);
                    }).catch(() => { //eslint-disable-line max-nested-callbacks
                        this.saveToken(dbInstance, response, resolve, reject);
                    });
                });
            }).catch(error => {
                FacebookRequestHandler.logger().error("error getting long lived token. Error: %s", error);
                reject("error getting long lived token with token " + this.accessToken);
            });
        });
    }

    _getAllOptions(userOptions) {
        let allOptions = userOptions ? userOptions : {};
        allOptions.fields = "link,message,picture,name,caption,place,tags,privacy,created_time";
        allOptions.limit = 100;
        return allOptions;
    }

    facebookClient() {
        let appSecretProof = this.appSecretProof();
        let appId = this.appId();
        return FacebookClient.instance(this.accessToken, appSecretProof, appId);
    }

    appSecretProof() {
        return CryptUtil.hmac("sha256", this.appSecretKey(), "hex", this.accessToken);
    }

    appSecretKey() {
        return ApplicationConfig.instance().facebook().appSecretKey;
    }

    appId() {
        return ApplicationConfig.instance().facebook().appId;
    }
}
