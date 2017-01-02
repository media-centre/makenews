import TwitterClient from "./TwitterClient";
import CouchClient from "../CouchClient";
import Logger from "../logging/Logger";

export default class TwitterRequestHandler {
    static instance() {
        return new TwitterRequestHandler();
    }

    static logger() {
        return Logger.instance();
    }

    fetchTweetsRequest(url, userName, timestamp) {
        return new Promise((resolve, reject) => {
            this.twitterClient().fetchTweets(url, userName, timestamp).then(tweets => {
                TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched feeds for url: %s.", url);
                resolve(tweets);
            }).catch(error => {
                TwitterRequestHandler.logger().error("TwitterRequestHandler:: error fetching facebook feeds of web url = %s.", url, error);
                reject(error);
            });
        });
    }

    async fetchFollowersRequest(authSession, keyword) {
        try {
            let userName = await this.getUserName(authSession);
            let followers = await this.twitterClient().fetchFollowers(userName, keyword);
            TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched followers for user");
            return followers;
        } catch (error) {
            TwitterRequestHandler.logger().error("TwitterRequestHandler:: error fetching followers list of the twitter user");
            throw(error);
        }
    }

    async getUserName(authSession) {
        let couchClient = await CouchClient.createInstance(authSession);
        let userName = await couchClient.getUserName();
        console.log("dbUserName",userName)
        return userName;
    }

    twitterClient() {
        return TwitterClient.instance();
    }
}
