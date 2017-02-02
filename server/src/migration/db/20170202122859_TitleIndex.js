import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class TitleIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("TitleIndex::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["title"]
                },
                "name": "TitleIndex"
            };
            return await CouchClient.instance(this.accessToken, this.dbName).createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("TitleIndex::up - error %j", error);
            throw error;
        }
    }
}
