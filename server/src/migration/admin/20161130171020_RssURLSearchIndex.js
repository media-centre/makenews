import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class IndexDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("RssURLSearchIndex::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["sourceType", "docType", "name"]
                },
                "name": "rssUrlSearch"
            };
            const couchClient = CouchClient.instance(this.accessToken, this.dbName);
            return await couchClient.createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("RssURLSearchIndex::up - error %j", error);
            throw error;
        }
    }
}
