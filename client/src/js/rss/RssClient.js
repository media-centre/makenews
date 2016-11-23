"use strict";
import AjaxClient from "../utils/AjaxClient.js";

export default class RssClient {

    static instance() {
        return new RssClient();
    }

     async fetchRssFeeds(url) {
        try {
            let ajaxClient = AjaxClient.instance("/rss-feeds");
            let response = await ajaxClient.get({"url": url});
            return response;
        }
        catch (error) {
            return error;
        }
        // return new Promise((resolve, reject) => {
        //     let ajaxClient = AjaxClient.instance("/rss-feeds");
        //     ajaxClient.get({ "url": url }).then(response => {
        //         resolve(response);
        //     }).catch(error => {
        //         reject(error);
        //     });
        // });
    }

    async fetchBatchRssFeeds(sourceUrlDetails, skipSessionTimer) {
        try {
            let ajaxClient = AjaxClient.instance("/fetch-all-rss", skipSessionTimer);
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            let feedMap = await ajaxClient.post(headers, sourceUrlDetails);
            return feedMap;
        }
        catch (error) {
            return error;
        }
        // return new Promise((resolve, reject) => {
        //     let ajaxClient = AjaxClient.instance("/fetch-all-rss", skipSessionTimer);
        //     const headers = {
        //         "Accept": "application/json",
        //         "Content-type": "application/json"
        //     };
        //     ajaxClient.post(headers, sourceUrlDetails).then((feedMap)=> {
        //         resolve(feedMap);
        //     }).catch((err)=> {
        //         reject(err);
        //     });
        // });
    }

    fetchURLDocument(searchKey) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/fetch-all-urls", skipSessionTi)
        })
    }
}
