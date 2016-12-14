import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class FetchFeedsIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("FetchFeedsIndex::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["pubDate", "docType"]
                },
                "name": "pubDate"
            };
            return await CouchClient.instance(this.dbName, this.accessToken).createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("FetchFeedsIndex::up - error %j", error);
            throw error;
        }
    }
}
