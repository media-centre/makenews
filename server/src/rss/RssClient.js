"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import Logger from "../logging/Logger.js";
import RssParser from "./RssParser";

let logger = Logger.instance();
export default class RssClient {

    static instance() {
        return new RssClient();
    }

    fetchRssFeeds(url) {
        return new Promise((resolve, reject) => {
            let requestToUrl = request(url);
            requestToUrl.on("error", (error) => {
                logger.warn("Request failed for %s", url, error);
                reject({ "message": "Request failed for " + url });
            });
            requestToUrl.on("response", function(res) {
                if(res.statusCode !== HttpResponseHandler.codes.OK) {
                    reject({ "message": "Bad status code" });
                }
                let rssParser = new RssParser(this);
                rssParser.parse()
                    .then(feeds => {
                        resolve(feeds);
                    })
                    .catch(error => {
                        logger.warn("%s is not a proper feed", url, error);
                        reject({ "message": url + " is not a proper feed" });
                    });
            });
        });
    }
}
