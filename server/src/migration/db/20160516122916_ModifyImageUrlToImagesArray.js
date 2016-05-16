"use strict";
import DesignDocumentMigration from "../helpers/DesignDocumentMigration.js";
import Migration from "../Migration.js";
import CouchClient from "../../CouchClient.js";

export default class ModifyImageUrlToImagesArray {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.designDocumentMigObj = DesignDocumentMigration.instance(dbName, accessToken, "_design/category");
        this.couchClient = CouchClient.instance(dbName, accessToken);
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("ModifyImageUrlToImagesArray::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._filterViews()).then(res => {
                Migration.logger(this.dbName).info("ModifyImageUrlToImagesArray::up - response %j", res);
                this.couchClient.get("/" + this.dbName + "/_design/category/_view/imageContentFeeds").then((response) => {
                    let feeds = response.rows;
                    for(let feed of feeds) {
                        feed.value.images = [{ "url": feed.value.url }];
                         this.couchClient.saveDocument(feed.value._id, feed.value);
                    }
                }).catch(error => {
                    Migration.logger(this.dbName).error("ModifyImageUrlToImagesArray::up - error %j", error);
                    reject(error);
                });
                resolve(res);
            }).catch(error => {
                Migration.logger(this.dbName).error("ModifyImageUrlToImagesArray::up - error %j", error);
                reject(error);
            });
        });
    }

    _filterViews() {
        return {
            "imageContentFeeds": {
                "map": "function(doc) { if(doc.type == 'imagecontent' && doc.url) {emit(doc._id, doc)} }"
            }
        };

    }
}
