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

    fetchBatchRssFeeds(sourceUrlDetails) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/fetch-all-rss");
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            ajaxClient.post(headers, sourceUrlDetails).then((feedMap)=> {
                resolve(feedMap);
            }).catch((err)=> {
                reject(err);
            });
        });
    }
}
