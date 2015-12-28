"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import Logger from "../logging/Logger.js";

export const baseURL = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("twitterURL"),
    searchApi = "/search/tweets.json", searchParams = "-filter:retweets";
let logger = Logger.instance();
export default class TwitterClient {

    static instance(bearerToken) {
        return new TwitterClient(bearerToken);
    }
    constructor(bearerToken) {
        this.bearerToken = bearerToken;
    }

    fetchTweets(url) {
        return new Promise((resolve, reject) => {
            let options = {
                "uri": baseURL + searchApi, "qs": { "q": url + searchParams }, "json": true,
                "headers": {
                    "Authorization": this.bearerToken
                }
            };
            request.get(options, (error, response, body) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK) && response.body.statuses.length > 0) {
                        resolve(body);
                    } else {
                        logger.warn("%s is not a valid twitter handler", url, error);
                        reject({ "message": url + " is not a valid twitter handler" });
                    }
                } else {
                    logger.warn("Request failed for twitter handler %s", url, error);
                    reject({ "message": "Request failed for twitter handler " + url });
                }
            });
        });
    }
}
