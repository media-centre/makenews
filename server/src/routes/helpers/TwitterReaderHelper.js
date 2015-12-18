/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import NodeErrorHandler from "../../NodeErrorHandler";
import StringUtil from "../../../../common/src/util/StringUtil";
import EnvironmentConfig from "../../config/EnvironmentConfig";
import restRequest from "request";

export const baseURL = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("twitterURL"), searchApi = "/search/tweets.json", searchParams = "-filter:retweets";
export default class TwitterReaderHelper {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    feedsForUrl() {

        let url = this.request.query.url;
        if(StringUtil.isEmptyString(url)) {
            this.setResponse(HttpResponseHandler.codes.OK, {});
        } else {
            let options = { "uri": baseURL + searchApi, "qs": { "q": url + searchParams }, "json": true, "headers": {
                "Authorization": EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("twitterBearerToken")
            }
            };
            restRequest.get(options,
                (error, response) => {
                    if(NodeErrorHandler.errored(error)) {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": "Request failed for twitter handler " + url });
                    } else if(this.isSuccefullResponse(response)) {
                        this.setResponse(HttpResponseHandler.codes.OK, response.body);
                    } else {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": url + " is not a valid twitter handler" });
                    }
                }
            );
        }
    }

    isSuccefullResponse(response) {
        return response.statusCode === HttpResponseHandler.codes.OK && response.body.statuses.length > 0;
    }

    setResponse(status, responseJson) {
        this.response.status(status);
        this.response.json(responseJson);
    }
}
