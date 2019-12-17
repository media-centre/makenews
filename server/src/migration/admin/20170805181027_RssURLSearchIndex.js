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
            const indexDoc = {
                "_id": "_design/webUrlSearch",
                "fulltext": {
                    "by_name": {
                        "index":
                            "function(doc) { if(doc.sourceType === 'web') { var ret=new Document(); ret.add(doc.name, {'field':'name', 'store': 'yes'}); ret.add(doc._id, {'field':'id', 'store': 'yes'}); return ret; } }"
                    }
                }
            };
            const couchClient = CouchClient.instance(this.accessToken, this.dbName);
            return await couchClient.saveDocument("_design/webUrlSearch", indexDoc);
        } catch (error) {
            Migration.logger(this.dbName).error("RssURLSearchIndex::up - error %j", error);
            throw error;
        }
    }
}
