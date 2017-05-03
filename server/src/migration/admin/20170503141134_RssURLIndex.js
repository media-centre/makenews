import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class RssUrlIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("RssUrlIndex::up - started");
            const rssUrlIndex = {
                "index": {
                    "fields": ["docType"]
                },
                "name": "RssUrlIndex"
            };
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(rssUrlIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("RssUrlIndex::up - error %j", error);
            throw error;
        }
    }
}
