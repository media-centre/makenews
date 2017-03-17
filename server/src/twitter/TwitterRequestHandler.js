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

    twitterClient() {
        return TwitterClient.instance();
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

    async fetchFollowings(authSession, nextCursor) {
        try {
            const userName = userDetails.getUser(authSession).userName;
            const followings = await this.twitterClient().fetchFollowings(userName, nextCursor);
            TwitterRequestHandler.logger().debug("TwitterRequestHandler:: Successfully fetched followings for user");
            return followings;
        }catch(error) {
            TwitterRequestHandler.logger().error(`TwitterRequestHandler:: Failed to fetch the followings ${error}`);
            if(error.statusCode === 429) { //eslint-disable-line no-magic-numbers
                const message = { "message": "Could not get more handles" };
                throw message;
            }
            throw error;
        }
    }
}
