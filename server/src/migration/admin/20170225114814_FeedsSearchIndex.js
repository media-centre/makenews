import Migration from "./../Migration";
import CouchClient from "./../../CouchClient";

export default class FeedsSearchIndexDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("FeedsSearchIndexDocument::up - started");
            let indexDoc = {
                "_id": "_design/feedSearch",
                "fulltext": {
                    "by_title": {
                        "index":
                            "function(doc) { if(doc.docType === 'feed') { return doc; } }"
                    }
                }
            };
            const couchClient = CouchClient.instance(this.accessToken, this.dbName);
            return await couchClient.saveDocument("_design/feedSearch", indexDoc);
        } catch (error) {
            Migration.logger(this.dbName).error("FeedsSearchIndexDocument::up - error %j", error);
            throw error;
        }
    }
}
