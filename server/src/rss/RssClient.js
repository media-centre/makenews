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
                RssClient.logger().error("RssClient:: Request failed for %s.", url, error);
                reject({ "message": "Request failed for " + url });
            });
            requestToUrl.on("response", function(res) {
                if(res.statusCode !== HttpResponseHandler.codes.OK) {
                    RssClient.logger().error("RssClient:: %s returned invalid status code '%s'.", res.statusCode);
                    reject({ "message": "Bad status code" });
                }
                let rssParser = new RssParser(this);
                rssParser.parse()
                    .then(feeds => {
                        RssClient.logger().debug("RssClient:: successfully fetched feeds for %s.", url);
                        resolve(feeds);
                    })
                    .catch(error => {
                        RssClient.logger().error("RssClient:: %s is not a proper feed url. Error: %s.", url, error);
                        reject({ "message": url + " is not a proper feed" });
                    });
            });
        });
    }
}
