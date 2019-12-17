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
            const indexDoc = {
                "_id": "_design/feedSearch",
                "fulltext": {
                    "by_document": {
                        "index": "function(doc) {if(doc.docType === 'feed') { var ret=new Document(); ret.add(doc.title,  {'field':'title', 'store': 'no'}); ret.add(doc.bookmark,  {'field':'bookmark', 'store': 'no'}); ret.add(doc.description,  {'field':'description', 'store': 'no'}); ret.add(doc.sourceType, {'field': 'sourceType', 'store': 'no'}); ret.add(new Date(doc.pubDate), {'field':'pubDate', 'store': 'no', 'type': 'date'}); return ret; } }" //eslint-disable-line max-len
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
