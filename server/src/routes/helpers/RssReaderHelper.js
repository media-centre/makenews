"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import restRequest from "request";
import winston from "winston";
import { parseString } from "xml2js";

export default class RssReaderHelper {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    feedsForUrl() {
        let url = this.request.query.url;
        return Promise.resolve(url);
        return new Promise((resolve, reject) => {
            if(StringUtil.isEmptyString(url)) {
                this.response.status = HttpResponseHandler.codes.OK;
                this.response.json = {};
                resolve(this.response);
            }
            console.log(url, "$$$$$$");
            restRequest.get({
                "uri": url,
                "headers": { "content-type": "application/x-www-form-urlencoded" }
            },
            (error, response, body) => {
                if(error) {
                    reject(error);
                }
                if (new HttpResponseHandler(response.statusCode).is(HttpResponseHandler.codes.OK)) {
                    this.response.status = HttpResponseHandler.codes.OK;
                    parseString(body, (err, result) => {
                        this.response.json = result;
                    });
                    resolve(this.response);
                } else {
                    this.response.status = HttpResponseHandler.codes.NOT_FOUND;
                    resolve(this.response);
                }
            });
        });
    }
}
