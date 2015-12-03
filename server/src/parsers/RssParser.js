/* eslint no-unused-vars:0 */
"use strict";

import FeedParser from "feedparser";
//import Logger from "../logging/Logger";
export default class RssParser {
    constructor(response) {
        this.response = response;
        this.feedParser = new FeedParser();
    }

    parse() {
        return new Promise((resolve, reject) => {
            let items = [];
            this.response.pipe(this.feedParser);
            this.feedParser.on("error", (error) => {
                //Logger.instance().warn("Parsing error %s", error);
                reject("Not a feed");
            });

            this.feedParser.on("readable", function() {
                let meta = this.meta, item = this.read();
                while(item) {
                    items.push(item);
                    item = this.read();
                }
            });

            this.feedParser.on("end", function() {
                resolve({ "items": items });
            });
        });
    }
}
