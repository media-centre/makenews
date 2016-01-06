"use strict";
import TwitterClient from "./TwitterClient.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";

export default class TwitterRequestHandler {

    static instance() {
        return new TwitterRequestHandler();
    }

    fetchTweetsRequest(url) {
        return new Promise((resolve, reject) => {
            this.twitterClient().fetchTweets(url).then(feeds => {
                resolve(feeds);
            }).catch(error => { //eslint-disable-line no-unused-vars
                reject(error);
            });
        });
    }

    twitterClient() {
        return TwitterClient.instance(this.getBearerToken());
    }

    getBearerToken() {
        return ApplicationConfig.instance().twitter().bearerToken;
    }
}
