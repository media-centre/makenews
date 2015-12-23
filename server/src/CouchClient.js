"use strict";

import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "./config/ApplicationConfig.js";
import NodeErrorHandler from "./NodeErrorHandler.js";

import request from "request";

export default class CouchClient {
    static instance(dbName, accessToken) {
        return new CouchClient(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    saveDocument(documentId, documentObj) {
        return new Promise((resolve, reject) => {
            request.put({
                "uri": ApplicationConfig.dbUrl() + "/" + this.dbName + "/" + documentId,
                "headers": {
                    "Cookie": "AuthSession=" + this.accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "body": documentObj,
                "json": true
            },
                (error, response) => {
                    if(NodeErrorHandler.noError(error)) {
                        if(response.statusCode === HttpResponseHandler.codes.OK) {
                            resolve(response.body);
                        } else {
                            reject("unexpected response from the db");
                        }
                    } else {
                        reject(error);
                    }
                });
        });
    }
}
