"use strict";
import TwitterClient from "./TwitterClient.js";

export default class TwitterRequestHandler {

    static fetchTweets(url) {
        return new Promise((resolve, reject) => {
            let twitterClient = TwitterClient.instance();
            twitterClient.fetchTweets(url).then(originalFeeds => {
                resolve(originalFeeds.statuses);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }
}

