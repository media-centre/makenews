"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import request from "request";
import Logger from "../logging/Logger.js";
import RssParser from "./RssParser";

export default class RssClient {

    static logger() {
        return Logger.instance();
    }

    static instance() {
        return new RssClient();
    }

    fetchRssFeeds(url) {
        return new Promise((resolve, reject) => {
            let requestToUrl = request.get({
                "uri": url,
                "timeout": 2000
            });

            requestToUrl.on("error", (error) => {
                RssClient.logger().warn("Request failed for %s", url, error);
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
                        RssClient.logger().warn("%s is not a proper feed", url, error);
                        reject({ "message": url + " is not a proper feed" });
                    });
            });
        });
    }
}
