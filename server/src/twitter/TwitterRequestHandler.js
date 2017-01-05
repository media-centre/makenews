import TwitterClient from "./TwitterClient";
import Logger from "../logging/Logger";
import { userDetails } from "../Factory";

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

    async fetchHandlesRequest(authSession, keyword, page, preFirstId) {
        try {
            let userName = userDetails.getUser(authSession).userName;
            let handles = await this.twitterClient().fetchHandles(userName, keyword, page, preFirstId);
            TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched handles for user");
            return handles;
        } catch (error) {
            TwitterRequestHandler.logger().error(`TwitterRequestHandler:: error fetching handles list of the twitter user ${JSON.stringify(error)}`);
            throw(error);
        }
    }

    twitterClient() {
        return TwitterClient.instance();
    }
}
