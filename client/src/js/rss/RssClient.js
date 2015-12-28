"use strict";
import AjaxClient from "../utils/AjaxClient.js";

export default class RssClient {

    static instance() {
        return new RssClient();
    }

    fetchRssFeeds(url) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/rss-feeds");
            ajaxClient.get({ "url": url }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
