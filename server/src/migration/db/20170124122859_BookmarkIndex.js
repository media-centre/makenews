import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class BookmarkIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("BookmarkIndex::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["bookmark"]
                },
                "name": "BookmarkIndex"
            };
            return await CouchClient.instance(this.accessToken, this.dbName).createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("BookmarkIndex::up - error %j", error);
            throw error;
        }
    }
}
