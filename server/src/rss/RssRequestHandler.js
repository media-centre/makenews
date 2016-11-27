import RssClient from "./RssClient";
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
        } catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
            throw error;
        }
    }

    rssClient() {
        return RssClient.instance();
    }

    async searchUrl(key) {
        try {
            let document = await this.rssClient().searchURL(key);
            RssRequestHandler.logger().debug("RssRquestHandler:: Successfully fetched for given selector");
            return document;
        }catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: Error while fething documents for selector. Error: %j", error);
            throw error;
        }
    }

    addURL(url) {
        return new Promise((resolve, reject) => {
            this.rssClient().addURL(url).then((response) => {
                RssRequestHandler.logger().debug("RssRequestHandler:: successfully added Document to database.");
                resolve(response);
            }).catch((error) => {
                RssRequestHandler.logger().error("RssRequestHandler:: Error while adding Document: %j.", error);
                reject(error);
            });
        });
    }
}
