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
    getDocument() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../documents/defaultURLDocument.json"), "utf-8"));  //eslint-disable-line no-sync
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("URLDocument::up - started");
            this.designDocumentMigObj.addOrUpdateViews(this._filterViews()).then(res => {
                Migration.logger(this.dbName).info("URLDocument::up - started");

                let categoryDocument = this.getDocument();

                request.post({
                        "uri": ApplicationConfig.instance().dbUrl() + "/" + this.dbName + "/_bulk_docs",
                        "headers": { "Cookie": "AuthSession=" + this.accessToken, "Content-Type": "application/json", "Accept": "application/json" },
                        "body": categoryDocument,
                        "json": true
                    },
                    (error, response) => {
                        if(NodeErrorHandler.noError(error)) {
                            if(new HttpResponseHandler(response.statusCode).success()) {
                                Migration.logger(this.dbName).debug("URLDocument::up - response %j", response.body);
                                resolve(response.body);
                            } else {
                                Migration.logger(this.dbName).error("URLDocument::up - error %j", response.body);
                                reject("unexpected response from the db");
                            }
                        } else {
                            Migration.logger(this.dbName).error("URLDocument::up - error %j", error);
                            reject(error);
                        }
                    });
                resolve(res);
            }).catch(error => {
                Migration.logger(this.dbName).error("URLDocument::up - error %j", error);
                reject(error);
            });
        });
    }

    _filterViews() {
        return {
            "defaultURLDocuments": {
                "map": "function(doc) { if(doc.sourceType == 'web') {emit(doc._id, doc)} }"
            }
        };

    }
}
