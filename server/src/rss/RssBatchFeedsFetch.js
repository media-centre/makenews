import RssClient from "./RssClient";
import CouchClient from "../CouchClient";

export default class RssBatchFeedsFetch {
    static instance() {
        return new RssBatchFeedsFetch();
    }

    async fetchBatchFeeds(url, authSession) {
        let rssClient = RssClient.instance();
        let feeds = await rssClient.getRssData(url);
        let response = await this.storeInDb(feeds, authSession);
        return response;
    }

    async storeInDb(feeds, accesstoken) {
        let SUCCESS_MESSAGE = "Successfully added feeds to Database";
        let couchClient = await CouchClient.createInstance(accesstoken);
        let feedObject = { "docs": feeds.items };
        await couchClient.saveBulkDocuments(feedObject);
        return SUCCESS_MESSAGE;

    }
}
