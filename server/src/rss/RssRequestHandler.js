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

    searchUrl(key) {
        return new Promise((resolve, reject) => {
            this.rssClient().searchURL(key).then(document => {
                RssRequestHandler.logger().debug("RssRquestHandler:: Successfully fetched for given selector");
                resolve(document);
            }).catch(error => {
                RssRequestHandler.logger().error("RssRequestHandler:: Error while fething documents for selector. Error: %j", error);
                reject(error);
            });
        });
    }

    addDocument(documentId, document) {
        return new Promise((resolve, reject) => {
            this.rssClient().addURL(document).then((response) => {
                RssRequestHandler.logger().debug("RssRequestHandler:: successfully added Document to database.");
                resolve(response);
            }).catch((error) => {
                RssRequestHandler.logger().error("RssRequestHandler:: Error while adding Document: %j.", error);
                reject(error);
            });
        });
    }
}
