/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import restRequest from "request";

export const baseURL = "https://api.twitter.com/1.1", searchApi = "/search/tweets.json";
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
            let options = { "uri": baseURL + searchApi, "qs": { "q": url }, "json": true };
            restRequest.get(options,
                (error, response) => {
                    if(error) {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": "Request failed for twitter handler " + url });
                    }
                    else if(response.statusCode !== HttpResponseHandler.codes.OK) {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": url + " is not a valid twitter handler" });
                    } else {
                        this.setResponse(HttpResponseHandler.codes.OK, response.body);
                    }
                }
            );
        }
    }

    setResponse(status, responseJson) {
        this.response.status(status);
        this.response.json(responseJson);
    }
}
