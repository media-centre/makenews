/* eslint consistent-this:0 no-unused-vars:0*/
"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../../common/src/util/StringUtil";
import restRequest from "request";
import RssParser from "../../parsers/RssParser";
//import Logger from "../../logging/Logger";

//let logger = Logger.instance();
export default class RssReaderHelper {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    feedsForUrl() {
        let url = this.request.query.url, _this = this;
        if(StringUtil.isEmptyString(url)) {
            this.setResponse(HttpResponseHandler.codes.OK, {});
        } else {
            let requestToUrl = restRequest(url), rssParser = null;
            requestToUrl.on("error", (error) => {
                //logger.warn("Request failed for %s", url, error);
                this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": "Request failed for " + url });
            });
            requestToUrl.on("response", function(res) {
                if(res.statusCode !== HttpResponseHandler.codes.OK) {
                    return this.emit("error", new Error("Bad status code"));
                }
                rssParser = new RssParser(this);
                rssParser.parse()
                    .then(feeds => {
                        _this.setResponse(HttpResponseHandler.codes.OK, feeds);
                    })
                    .catch(error => {
                        //logger.warn("%s is not a proper feed", url, error);
                        _this.setResponse(HttpResponseHandler.codes.NOT_FOUND, { "message": url + " is not a proper feed" });
                    });
            });
        }
    }

    setResponse(status, responseJson) {
        this.response.status(status);
        this.response.json(responseJson);
    }
}
