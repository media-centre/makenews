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
            let options = { "uri": baseURL + searchApi, "qs": { "q": url }, "json": true, "headers": {
                "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAAD%2BCjAAAAAAA6o%2F%2B5TG9BK7jC7dzrp%2F2%2Bs5lWFE%3DZATD8UM6YQoou2tGt68hoFR4VuJ4k791pcLtmIvTyfoVbMtoD8"
            }
            };

            restRequest.get(options,
                (error, response) => {
                    if(error) {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": "Request failed for twitter handler " + url });
                    } else if(response.statusCode === HttpResponseHandler.codes.OK) {
                        this.setResponse(HttpResponseHandler.codes.OK, response.body);
                    } else {
                        this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": url + " is not a valid twitter handler" });
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
