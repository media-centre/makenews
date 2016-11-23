import TwitterClient from "./TwitterClient";

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
    static fetchBatchTweets(twitterBatch, skipSessionTimer) {
        return new Promise((resolve, reject) => {
            let twitterClient = TwitterClient.instance();
            twitterClient.fetchBatchTweets(twitterBatch, skipSessionTimer).then(feedMap => {
                resolve(feedMap);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }

    static requestToken(clientCallbackUrl, serverCallbackUrl, userName) {
        return new Promise((resolve, reject) => {
            let twitterClient = TwitterClient.instance();
            twitterClient.requestToken(clientCallbackUrl, serverCallbackUrl, userName).then(response => {
                resolve(response);
            }).catch(error => { // eslint-disable-line
                reject([]);
            });
        });
    }
}

