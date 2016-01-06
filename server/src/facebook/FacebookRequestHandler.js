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

    pagePosts(pageName) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(pageName)) {
                reject("page name can not be null");
            } else {
                this.facebookClient().pagePosts(pageName).then(feeds => {
                    resolve(feeds);
                }).catch(error => { //eslint-disable-line no-unused-vars
                    reject("error fetching feeds for a " + pageName + " page.");
                });
            }
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
