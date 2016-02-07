"use strict";
import RssClient from "./RssClient.js";
import Logger from "../logging/Logger";

export default class RssRequestHandler {

    static instance() {
        return new RssRequestHandler();
    }

    static logger() {
        return Logger.instance();
    }

    fetchRssFeedRequest(url) {
        return new Promise((resolve, reject) => {
            this.rssClient().fetchRssFeeds(url).then(feeds => {
                RssRequestHandler.logger().debug("RssRequestHandler:: successfully fetched feeds for %s.", url);
                resolve(feeds);
            }).catch(error => {
                RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %s.", url, error);
                reject(error);
            });
        });
    }

    rssClient() {
        return RssClient.instance();
    }
}
