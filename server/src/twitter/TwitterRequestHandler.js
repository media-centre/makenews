"use strict";
import TwitterClient from "./TwitterClient.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";

export default class TwitterRequestHandler {

    static instance() {
        return new TwitterRequestHandler();
    }

    constructor() {

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
        return EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION).get("twitterBearerToken");
    }
}
