import FeedsClient from "./FeedsClient";

export default class FeedsRequestHandler {
    static instance() {
        return new FeedsRequestHandler();
    }

    async fetchFeeds(authSession) {
        let feedsClient = FeedsClient.instance();
        return feedsClient.getFeeds(authSession);
    }
}
