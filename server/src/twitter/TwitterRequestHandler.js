"use strict";
import TwitterClient from "./TwitterClient.js";

export default class TwitterRequestHandler {
    static instance() {
        return new TwitterRequestHandler();
    }

    fetchTweetsRequest(url, userName, timestamp) {
        return new Promise((resolve, reject) => {
            this.twitterClient().fetchTweets(url, userName, timestamp).then(feeds => {
                resolve(feeds);
            }).catch(error => { //eslint-disable-line no-unused-vars
                reject(error);
            });
        });
    }

    twitterClient() {
        return TwitterClient.instance();
    }
}
