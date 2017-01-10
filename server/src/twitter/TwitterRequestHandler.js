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

    async fetchTweetsRequest(url, timestamp, authSession) {
        try {
            let userName = userDetails.getUser(authSession).userName;
            let tweets = await this.twitterClient().fetchTweets(url, userName, timestamp);
            TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched twitter handles for: %s.", url);
            return tweets;
        } catch (error) {
            TwitterRequestHandler.logger().error("TwitterRequestHandler:: error fetching twitter handle for  = %s.", url, error);
            throw(error);
        }
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
