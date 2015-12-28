"use strict";
import RssClient from "./RssClient.js";

export default class RssRequestHandler {

    static fetchRssFeeds(url) {
        return new Promise((resolve, reject) => {
            let rssClient = RssClient.instance();
            rssClient.fetchRssFeeds(url).then(originalFeeds => {
                resolve(originalFeeds);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }
}
