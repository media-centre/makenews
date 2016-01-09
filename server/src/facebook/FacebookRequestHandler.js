"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import FacebookClient from "./FacebookClient.js";
import CryptUtil from "../../src/util/CryptUtil.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";

export default class FacebookRequestHandler {

    static instance(accessToken) {
        return new FacebookRequestHandler(accessToken);
    }
    constructor(accessToken) {
        if(StringUtil.isEmptyString(accessToken)) {
            throw new Error("access token can not be empty");
        }
        this.accessToken = accessToken;
    }

    pagePosts(webUrl) {
        return new Promise((resolve, reject) => {
            let facebookClientInstance = this.facebookClient();
            facebookClientInstance.getFacebookId(webUrl).then(pageId => {
                let requiredFields = "link,message,picture,name,caption,place,tags,privacy,created_time";
                facebookClientInstance.pagePosts(pageId, { "fields": requiredFields }).then(feeds => {
                    resolve(feeds);
                }).catch(error => { //eslint-disable-line
                    reject("error fetching facebook feeds of web url = " + webUrl);
                });
            }).catch(error => { //eslint-disable-line
                reject("error fetching facebook id of web url = " + webUrl);
            });
        });
    }

    facebookClient() {
        let appSecretProof = this.appSecretProof();
        return FacebookClient.instance(this.accessToken, appSecretProof);
    }

    appSecretProof() {
        return CryptUtil.hmac("sha256", this.appSecretKey(), "hex", this.accessToken);
    }

    appSecretKey() {
        return ApplicationConfig.instance().facebook().appSecretKey;
    }
}
