/* eslint no-unused-vars:0 */
"use strict";

import FeedParser from "feedparser";
import Logger from "../logging/Logger";
export default class RssParser {
    constructor(response) {
        this.response = response;
        this.feedParser = new FeedParser();
    }

    static logger() {
        return Logger.instance();
    }

    parse() {
        return new Promise((resolve, reject) => {
            let items = [];
            this.response.pipe(this.feedParser);
            this.feedParser.on("error", (error) => {
                RssParser.logger().error("RssParser:: Parsing error %s", error);
                reject("Not a feed");
            });

            this.feedParser.on("readable", function() {
                let meta = this.meta, feed = this.read();
                while(feed) {
                    items.push({
                        "guid": feed.guid,
                        "title": feed.title,
                        "link": feed.link,
                        "description": feed.description,
                        "pubDate": feed.pubDate,
                        "enclosures": feed.enclosures,
                        "image": feed.image
                    });
                    feed = this.read();
                }
            });

            this.feedParser.on("end", function() {
                RssParser.logger().debug("RssParser:: Done parsing feeds.");
                resolve({ "items": items });
            });
        });
    }
}
