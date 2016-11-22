import RssClient from "./RssClient";
import Logger from "../logging/Logger";
import AdminDbClient from "../db/AdminDbClient";
import ApplicationConfig from "../config/ApplicationConfig";

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
                RssRequestHandler.logger().debug("WebRequestHandler:: successfully fetched feeds for %s.", url);
                resolve(feeds);
            }).catch(error => {
                RssRequestHandler.logger().error("WebRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
                reject(error);
            });
        });
    }

    rssClient() {
        return RssClient.instance();
    }

    searchUrl(selector) {
        return new Promise((resolve, reject) => {
            const adminDetails = ApplicationConfig.instance().adminDetails();
            AdminDbClient.instance(adminDetails.username, adminDetails.password, adminDetails.db).then(dbInstance => {
                dbInstance.getUrlDocument(selector).then((document) => {
                    RssRequestHandler.logger().debug("WebRequestHandler:: successfully fetched feeds for the selector.");
                    resolve(document);
                }).catch((error) => {
                    RssRequestHandler.logger().error("WebRequestHandler:: selector is not a proper feed url. Error: %j.", error);
                    reject(error);
                });
            });
        });
    }
}
