import DesignDocumentMigration from "../helpers/DesignDocumentMigration";
import Migration from "../Migration";
import CouchClient from "../../CouchClient";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../../config/ApplicationConfig";
import NodeErrorHandler from "../../NodeErrorHandler";
import request from "request";

export default class URLDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.designDocumentMigObj = DesignDocumentMigration.instance(dbName, accessToken, "_design/category");
        this.couchClient = CouchClient.instance(dbName, accessToken);
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("URLDocument::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._defaultURLViews()).then(res => {
                Migration.logger(this.dbName).info("URLDocument::up - started");
                resolve(res);
            }).catch(error => {
                Migration.logger(this.dbName).error("URLDocument::up - error %j", error);
                reject(error);
            });
        });
    }

    _defaultURLViews() {
        return {
            "defaultURLDocuments": {
                "map": "function(doc) { if(doc.sourceType == 'web') {emit(doc._id, doc)} }"
            }
        };

    }
}
