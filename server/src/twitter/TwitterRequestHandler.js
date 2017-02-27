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

    async fetchTweetsRequest(url, since, authSession, sinceId) {
        const userName = userDetails.getUser(authSession).userName;
        const tweets = await this.twitterClient().fetchTweets(url, userName, since, sinceId);
        TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched twitter handles for: %s.", url);
        return tweets;
    }

    async fetchHandlesRequest(authSession, keyword, page, preFirstId) {
        const userName = userDetails.getUser(authSession).userName;
        const handles = await this.twitterClient().fetchHandles(userName, keyword, page, preFirstId);
        TwitterRequestHandler.logger().debug("TwitterRequestHandler:: successfully fetched handles for user");
        return handles;
    }

    twitterClient() {
        return TwitterClient.instance();
    }
}
