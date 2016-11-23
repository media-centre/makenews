import AjaxClient from "../utils/AjaxClient";
import AppSessionStorage from "../utils/AppSessionStorage";

export default class TwitterClient {

    static instance() {
        return new TwitterClient();
    }

    fetchTweets(url) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/twitter-feeds");
            let userName = AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.USERNAME);
            ajaxClient.get({ "url": url, "userName": userName }).then(response => {
                resolve(response);

            }).catch(error => {
                reject(error);
            });
        });
    }

    fetchBatchTweets(feedBatch, skipSessionTimer) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/twitter-batch-feeds", skipSessionTimer);
            let userName = AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.USERNAME);
            const headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            feedBatch.userName = userName;
            ajaxClient.post(headers, feedBatch).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    requestToken(clientCallbackUrl, serverCallbackUrl, userName) {
        return new Promise((resolve, reject) => {
            let ajaxClient = AjaxClient.instance("/twitter-request-token");
            ajaxClient.get({ "clientCallbackUrl": clientCallbackUrl, "serverCallbackUrl": serverCallbackUrl, "userName": userName }).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }
}
