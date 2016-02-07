"use strict";
import TwitterClient from "./TwitterClient.js";
import Logger from "../logging/Logger";

export default class TwitterRequestHandler {
    static instance() {
        return new TwitterRequestHandler();
    }

    static logger() {
        Logger.instance();
    }

    fetchTweetsRequest(url, userName, timestamp) {
        return new Promise((resolve, reject) => {
                this.twitterClient().fetchTweets(url, userName, timestamp).then(tweets => {
                TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched feeds for url: %s.", url);
                resolve(tweets);
            }).catch(error => {
                TwitterRequestHandler.logger().error("TwitterRequestHandler:: error fetching facebook feeds of web url = %s. Error: %s", url, error);
                reject(error);
            });
        });
    }

    twitterClient() {
        return TwitterClient.instance();
    }
}
