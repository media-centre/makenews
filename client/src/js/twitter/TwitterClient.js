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
}
