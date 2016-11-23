import DesignDocumentMigration from "../helpers/DesignDocumentMigration";
import Migration from "../Migration";
import CouchClient from "../../CouchClient";

export default class ChangeGalleryTypeFeed {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.designDocumentMigObj = DesignDocumentMigration.instance(dbName, accessToken, "_design/category");
        this.couchClient = CouchClient.instance(dbName, accessToken);
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("ChangeGalleryTypeFeed::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._filterViews()).then(res => {
                Migration.logger(this.dbName).info("ChangeGalleryTypeFeed::up - response %j", res);
                this.couchClient.get("/" + this.dbName + "/_design/category/_view/galleryFeeds").then((response) => {
                    let feeds = response.rows;
                    for(let feed of feeds) {
                        feed.value.type = "imagecontent";
                        this.couchClient.saveDocument(feed.value._id, feed.value);
                    }
                }).catch(error => {
                    Migration.logger(this.dbName).error("ChangeGalleryTypeFeed::up - error %j", error);
                    reject(error);
                });
                resolve(res);
            }).catch(error => {
                Migration.logger(this.dbName).error("ChangeGalleryTypeFeed::up - error %j", error);
                reject(error);
            });
        });
    }

    _filterViews() {
        return {
            "galleryFeeds": {
                "map": "function(doc) { if(doc.type == 'gallery') {emit(doc._id, doc)} }"
            }
        };

    }
}
