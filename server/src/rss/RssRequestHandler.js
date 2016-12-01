import RssClient from "./RssClient";
import Logger from "../logging/Logger";
import RssBatchFeedsFetch from "./RssBatchFeedsFetch";

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

    async fetchBatchRssFeedsRequest(url, authSession) {
        try {
            let responseMessage = await this.rssBatchFeedsFetch().fetchBatchFeeds(url, authSession);
            RssRequestHandler.logger().debug("RssRequestHandler:: successfully fetched feeds for %s.", url);
            return responseMessage;
        } catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
            throw error;
        }
    }


    rssBatchFeedsFetch() {
        return RssBatchFeedsFetch.instance();
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

    async addURL(url, accessToken) {
        try {
            let response = await this.rssClient().addURL(url, accessToken);
            RssRequestHandler.logger().debug("RssRequestHandler:: successfully added Document to database.");
            return response;
        } catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: Error while adding Document: %j.", error);
            throw error;
        }
    }

    async addURLToUserDb(accessToken, url, dbName) {
        try {
            let response = await this.rssClient().addURLToUser(accessToken, url, dbName);
            RssRequestHandler.logger().debug("RssRequestHandler:: successfully added Document to database.");
            return response;
        } catch(error) {
            RssRequestHandler.logger().error("RssRequestHandler:: Error while adding Document: %j.", error);
            throw error;
        }
    }
}
