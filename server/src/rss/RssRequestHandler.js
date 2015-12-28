"use strict";
import RssClient from "./RssClient.js";

export default class RssRequestHandler {

    static instance() {
        return new RssRequestHandler();
    }

    fetchRssFeedRequest(url) {
        return new Promise((resolve, reject) => {
            this.rssClient().fetchRssFeeds(url).then(feeds => {
                resolve(feeds);
            }).catch(error => { //eslint-disable-line no-unused-vars
                reject(error);
            });
        });
    }

    rssClient() {
        return RssClient.instance();
    }
}
