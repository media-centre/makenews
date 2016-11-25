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
            await this.storeInDb(feeds, authSession);
            return { "message": "successfully stored into db" };
        }catch(error) {
            RssBatchFeedsFetch.logger().error("RssBatchFeedsFetch:: could not fetch feeds. Error: %j.", error);
            throw { "message": error };
        }

    }

    async storeInDb(feeds, accesstoken) {
        try {
            let couchClient = new CouchClient(null, accesstoken);
            let response = couchClient.get("/_session");
            let userName = response.UserCtx.name;
            let userDbName = CryptUtil.dbNameHash(userName);
            couchClient.dbName = userDbName;
            let feedObject = {"docs": feeds.items};
            couchClient.saveBulkDocuments(feedObject);
        } catch(error) {
            RssBatchFeedsFetch.logger().error("RssBatchFeedsFetch:: could not able to store in db. Error: %j.", error);
            throw { "message": error };
        }
    }
}