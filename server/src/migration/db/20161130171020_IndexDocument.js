import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class IndexDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("IndexDocument::up - started");
            let nameIdIndex = {
                "index": {
                    "fields": ["name", "id"]
                },
                "name": "name-id"
            };
            return await CouchClient.instance(this.dbName, this.accessToken).createIndex(nameIdIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("IndexDocument::up - error %j", error);
            console.log("ee", error);
            throw error;
        }
    }
}
