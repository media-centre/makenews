"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../config/ApplicationConfig.js";
import request from "request";

export default class CreateCategoryDesignDocument {
    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    getDocument() {

    }

    up() {
        return new Promise((resolve, reject) => {
            let categoryDocument = this.getDocument();
            request.put({
                "uri": ApplicationConfig.dbUrl() + "/" + this.dbName + "/_design/category",
                "headers": { "Cookie": "AuthSession=" + this.accessToken, "Content-Type": "application/json", "Accept": "application/json" },
                "body": categoryDocument,
                "json": true
            },
            (error, response) => {
                if(!error && response.statusCode === HttpResponseHandler.codes.OK) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
}
