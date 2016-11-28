import RssClient from "./RssClient";
import CouchClient from "../CouchClient";
import CryptUtil from "../util/CryptUtil";

export default class RssBatchFeedsFetch {
    static instance() {
        return new RssBatchFeedsFetch();
    }

    async fetchBatchFeeds(url, authSession) {
        let rssClient = RssClient.instance();
        try {
            let feeds = await rssClient.getRssData(url);
            let response = await this.storeInDb(feeds, authSession);
            return response;
        }catch(error) {
            // RssBatchFeedsFetch.logger().error("RssBatchFeedsFetch:: could not fetch feeds. Error: %j.", error);
            throw (error);
        }

    }

    async storeInDb(feeds, accesstoken) {
        let SUCCESS_MESSAGE = "Successfully added feeds to Database";
        try {
            let couchClient = CouchClient.instance(null, accesstoken);
            let response = await couchClient.get("/_session");
            let userName = response.userCtx.name;
            let userDbName = CryptUtil.dbNameHash(userName);
            couchClient.dbName = userDbName;
            let feedObject = { "docs": feeds.items };
            await couchClient.saveBulkDocuments(feedObject);
            return SUCCESS_MESSAGE;
        } catch(error) {
            // RssBatchFeedsFetch.logger().error("RssBatchFeedsFetch:: could not able to store in db. Error: %j.", error);
            throw (error);
        }
    }
}