"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../config/ApplicationConfig.js";
import NodeErrorHandler from "../../NodeErrorHandler.js";
import Migration from "../Migration.js";
import request from "request";
import fs from "fs";
import path from "path";

export default class URLDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    getDocument() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../documents/defaultURLDocument.json"), "utf-8"));  //eslint-disable-line no-sync
    }

    up() {
        return new Promise((resolve, reject) => {
            Migration.logger(this.dbName).info("URLDocument::up - started");
            let categoryDocument = this.getDocument();
            request.put({
                    "uri": ApplicationConfig.instance().dbUrl() + "/" + this.dbName + "/_all_docs?include_docs=true",
                    "headers": { "Cookie": "AuthSession=" + this.accessToken, "Content-Type": "application/json", "Accept": "application/json" },
                    "body": categoryDocument,
                    "json": true
                },
                (error, response) => {
                    if(NodeErrorHandler.noError(error)) {
                        if(new HttpResponseHandler(response.statusCode).success()) {
                            Migration.logger(this.dbName).debug("URLDocument::up - success %j", response.body);
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
        });
    }
}

