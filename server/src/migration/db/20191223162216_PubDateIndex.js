import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class PubDateIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("PubDateIndex::up - started");
            const fetchFeedsWithPubDateIndex = {
                "index": {
                    "fields": ["pubDate"]
                },
                "name": "fetchFeedsWithPubDateIndex"
            };

            await CouchClient.instance(this.accessToken, this.dbName).createIndex(fetchFeedsWithPubDateIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("AppIndex::up - error %j", error);
            throw error;
        }
    }
}
