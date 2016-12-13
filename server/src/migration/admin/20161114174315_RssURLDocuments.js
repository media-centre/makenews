import Migration from "../Migration";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../../config/ApplicationConfig";
import NodeErrorHandler from "../../NodeErrorHandler";
import fs from "fs";
import path from "path";
import request from "request";

export default class URLDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    getDocument() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../documents/WebURLDocuments.json"), "utf-8"));  //eslint-disable-line no-sync
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("RssURLDocuments::up - started");
            let categoryDocument = this.getDocument();
            request.post({
                "uri": ApplicationConfig.instance().dbUrl() + "/" + this.dbName + "/_bulk_docs",
                "headers": {
                    "Cookie": "AuthSession=" + this.accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "body": categoryDocument,
                "json": true
            },
                (error, response) => {
                    if (NodeErrorHandler.noError(error)) {
                        if (new HttpResponseHandler(response.statusCode).success()) {
                            Migration.logger(this.dbName).debug("RssURLDocuments::up - response %j", response.body);
                            resolve(response.body);
                        } else {
                            Migration.logger(this.dbName).error("RssURLDocuments::up - error %j", response.body);
                            reject("unexpected response from the db");
                        }
                    } else {
                        Migration.logger(this.dbName).error("RssURLDocuments::up - error %j", error);
                        reject(error);
                    }
                });
        });
    }
}
