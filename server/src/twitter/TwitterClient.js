"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import NodeErrorHandler from "../NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import Logger from "../logging/Logger.js";

export const searchApi = "/search/tweets.json", searchParams = "-filter:retweets";
export default class TwitterClient {

    static logger() {
        return Logger.instance();
    }
    static instance(bearerToken) {
        return new TwitterClient(bearerToken);
    }
    constructor(bearerToken) {
        this.bearerToken = bearerToken;
    }

    fetchTweets(url) {
        return new Promise((resolve, reject) => {
            let options = {
                "uri": this._baseUrl() + searchApi, "qs": { "q": url + searchParams }, "json": true,
                "headers": {
                    "Authorization": this.bearerToken
                },
                "timeout": this._timeOut()
            };
            request.get(options, (error, response, body) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK) && response.body.statuses.length > 0) {
                        resolve(body);
                    } else {
                        TwitterClient.logger().warn("%s is not a valid twitter handler", url, error);
                        reject({ "message": url + " is not a valid twitter handler" });
                    }
                } else {
                    TwitterClient.logger().warn("Request failed for twitter handler %s", url, error);
                    reject({ "message": "Request failed for twitter handler " + url });
                }
            });
        });
    }

    _baseUrl() {
        return ApplicationConfig.instance().twitter().url;
    }

    _timeOut() {
        return ApplicationConfig.instance().twitter().timeOut;
    }
}
