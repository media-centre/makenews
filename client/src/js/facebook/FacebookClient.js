"use strict";
import StringUtil from "../../../../common/src/util/StringUtil.js";
import AjaxClient from "../utils/AjaxClient.js";

export default class FacebookClient {

    static instance(accessToken) {
        return new FacebookClient(accessToken);
    }
    constructor(accessToken) {
        if(StringUtil.isEmptyString(accessToken)) {
            throw new Error("access token can not be empty");
        }
        this.accessToken = accessToken;
    }

    fetchPosts(webUrl) {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(webUrl)) {
                reject("web url cannot be empty");
            }
            let ajaxClient = AjaxClient.instance("/facebook-posts");
            ajaxClient.get({ "accessToken": this.accessToken, "webUrl": webUrl }).then(response => {
                resolve(response);

            }).catch(error => {
                reject(error);
            });
        });
    }
}
