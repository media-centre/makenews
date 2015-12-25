"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../config/ApplicationConfig.js";
import NodeErrorHandler from "../../NodeErrorHandler.js";

import request from "request";
import fs from "fs";
import path from "path";

export default class CreateCategoryDesignDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    getDocument() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "../documents/categoryDesignDocument.json"), "utf-8"));  //eslint-disable-line no-sync
    }

    up() {
        return new Promise((resolve, reject) => {
            console.log("CreateCategoryDesignDocument::up - started");
            let categoryDocument = this.getDocument();
            request.put({
                "uri": ApplicationConfig.dbUrl() + "/" + this.dbName + "/_design/category",
                "headers": { "Cookie": "AuthSession=" + this.accessToken, "Content-Type": "application/json", "Accept": "application/json" },
                "body": categoryDocument,
                "json": true
            },
            (error, response) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).success()) {
                        console.log("CreateCategoryDesignDocument::up - success ", response.body);
                        resolve(response.body);
                    } else {
                        console.log("CreateCategoryDesignDocument::up - error ", response.body);
                        reject("unexpected response from the db");
                    }
                } else {
                    console.log("CreateCategoryDesignDocument::up - error ", error);
                    reject(error);
                }
            });
        });
    }
}
