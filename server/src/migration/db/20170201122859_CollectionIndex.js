import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class CollectionIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("CollectionIndex::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["collection", "collectionId"]
                },
                "name": "CollectionIndex"
            };
            return await CouchClient.instance(this.accessToken, this.dbName).createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("CollectionIndex::up - error %j", error);
            throw error;
        }
    }
}
