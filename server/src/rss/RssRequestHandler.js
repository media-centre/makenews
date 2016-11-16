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

    async fetchRssFeedRequest(url) {
        try {
            let feeds = await this.rssClient().fetchRssFeeds(url);
            RssRequestHandler.logger().debug("RssRequestHandler:: successfully fetched feeds for %s.", url);
            return feeds;
        }
        catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
            return error;
        }
        // return new Promise((resolve, reject) => {
        //     this.rssClient().fetchRssFeeds(url).then(feeds => {
        //         RssRequestHandler.logger().debug("RssRequestHandler:: successfully fetched feeds for %s.", url);
        //         resolve(feeds);
        //     }).catch(error => {
        //         RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
        //         reject(error);
        //     });
        // });
    }

    rssClient() {
        return RssClient.instance();
    }
}
