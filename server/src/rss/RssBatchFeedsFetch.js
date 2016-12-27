import RssClient from "./RssClient";

export default class RssBatchFeedsFetch {
    static instance() {
        return new RssBatchFeedsFetch();
    }

    async fetchBatchFeeds(url) {
        let rssClient = RssClient.instance();
        let feeds = await rssClient.getRssData(url);
        return feeds.items;
    }
}
