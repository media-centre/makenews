"use strict";
import StringUtil from "../../../common/src/util/StringUtil.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import querystring from "querystring";


export default class FacebookClient {

    constructor(accessToken, appSecretProof) {
        this.accessToken = accessToken;
        this.appSecretProof = appSecretProof;
    }

    pageFeeds(pageName) {
        return new Promise((resolve, reject) => {
            request.get({
                "url": "https://graph.facebook.com/v2.5/" + pageName + "/feed?access_token=" + this.accessToken + "&appsecret_proof=" + this.appSecretProof
            }, (error, response, body) => {
                if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                    let feedResponce = JSON.parse(body);
                    resolve(feedResponce.data);
                }
            });
        });
    }
}
