"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../config/ApplicationConfig.js";
import NodeErrorHandler from "../../NodeErrorHandler.js";

import request from "request";
import fs from "fs";
import path from "path";

export default class CreateDefaultCategoryDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    getDocument() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../documents/defaultCategoryDocument.json"), "utf-8"));  //eslint-disable-line no-sync
    }

    up() {
        return new Promise((resolve, reject) => {
            console.log("CreateDefaultCategoryDocument::up - started");
            let categoryDocument = this.getDocument();
            request.post({
                "uri": ApplicationConfig.dbUrl() + "/" + this.dbName,
                "headers": { "Cookie": "AuthSession=" + this.accessToken, "Content-Type": "application/json", "Accept": "application/json" },
                "body": categoryDocument,
                "json": true
            },
            (error, response) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).success()) {
                        console.log("CreateDefaultCategoryDocument::up - response ", response.body);
                        resolve(response.body);
                    } else {
                        console.log("CreateDefaultCategoryDocument::up - error ", response.body);
                        reject("unexpected response from the db");
                    }
                } else {
                    console.log("CreateDefaultCategoryDocument::up - error ", error);
                    reject(error);
                }
            });
        });
    }
}
