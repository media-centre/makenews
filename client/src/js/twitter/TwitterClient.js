"use strict";
import AjaxClient from "../utils/AjaxClient.js";

export default class TwitterClient {

    static instance() {
        return new TwitterClient();
    }

    fetchTweets(url) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/twitter-feeds");
            ajaxClient.get({ "url": url }).then(response => {
                resolve(response);

            }).catch(error => {
                reject(error);
            });
        });
    }

    fetchBatchTweets(feedBatch) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/twitter-batch-feeds");
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            ajaxClient.post(headers, feedBatch).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
