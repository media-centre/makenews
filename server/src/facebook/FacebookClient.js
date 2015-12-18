"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";

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
    }

    pagePosts(pageName, fields = "link,message,picture,name,caption,place,tags,privacy,created_time") {
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(pageName)) {
                reject({
                    "message": "page name cannot be empty",
                    "type": "InvalidArgument"
                });
            }
            request.get({
                "url": EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("facebookURL") + pageName + "/posts?fields=" + fields + "&access_token=" + this.accessToken + "&appsecret_proof=" + this.appSecretProof
            }, (error, response, body) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                        let feedResponse = JSON.parse(body);
                        resolve(feedResponse.data);
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
}
