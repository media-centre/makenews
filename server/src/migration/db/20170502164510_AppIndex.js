import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class AppIndex {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    async up() {
        try {
            Migration.logger(this.dbName).info("AppIndex::up - started");
            const titleIndex = {
                "index": {
                    "fields": ["title"]
                },
                "name": "TitleIndex"
            };
            const docTypeIndex = {
                "index": {
                    "fields": ["docType"]
                },
                "name": "DocTypeIndex"
            };
            const sourceDeletedIndex = {
                "index": {
                    "fields": ["sourceDeleted", "docType"]
                },
                "name": "sourceDeletedIndex"
            };
            const sourcesWithHashtagIndex = {
                "index": {
                    "fields": ["hashtag", "docType"]
                },
                "name": "SourcesWithHashtagIndex"
            };
            const collectionIndex = {
                "index": {
                    "fields": ["collection", "docType"]
                },
                "name": "collectionIndex"
            };
            const collectionIdIndex = {
                "index": {
                    "fields": ["collectionId", "docType"]
                },
                "name": "collectionIdIndex"
            };
            const bookmarkIndex = {
                "index": {
                    "fields": ["bookmarkedDate", "bookmark"]
                },
                "name": "BookmarkIndex"
            };
            const fetchFeedsIndex = {
                "index": {
                    "fields": ["pubDate", "docType", "sourceType", "sourceId"]
                },
                "name": "fetchFeedsIndex"
            };

            await CouchClient.instance(this.accessToken, this.dbName).createIndex(titleIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(docTypeIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(sourceDeletedIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(sourcesWithHashtagIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(collectionIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(collectionIdIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(bookmarkIndex);
            await CouchClient.instance(this.accessToken, this.dbName).createIndex(fetchFeedsIndex);
        } catch (error) {
            Migration.logger(this.dbName).error("AppIndex::up - error %j", error);
            throw error;
        }
    }
}
