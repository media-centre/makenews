"use strict";

import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "./config/ApplicationConfig.js";
import NodeErrorHandler from "./NodeErrorHandler.js";

import request from "request";

export default class CouchClient {
    static instance(dbName, accessToken, dbUrl) {
        return new CouchClient(dbName, accessToken, dbUrl);
    }

    constructor(dbName, accessToken, dbUrl) {
        this.dbName = dbName;
        this.accessToken = accessToken;
        this.dbUrl = dbUrl || ApplicationConfig.instance().dbUrl();
    }

    saveDocument(documentId, documentObj) {
        const path = "/" + this.dbName + "/" + documentId;
        return this.put(path, documentObj);
    }

    getDocument(documentId) {
        const path = "/" + this.dbName + "/" + documentId;
        return this.get(path);
    }

    put(path, body) {
        return new Promise((resolve, reject) => {
            request.put({
                "uri": this.dbUrl + path,
                "headers": {
                    "Cookie": "AuthSession=" + this.accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "body": body || {},
                "json": true
            },
            (error, response) => {
                this.handleResponse(error, response, resolve, reject);
            });
        });
    }

    get(path, data) {
        return new Promise((resolve, reject) => {
            request.get({
                "uri": this.dbUrl + path,
                "headers": {
                    "Cookie": "AuthSession=" + this.accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                "data": data || {},
                "json": true
            },
            (error, response) => {
                this.handleResponse(error, response, resolve, reject);
            });
        });
    }

    handleResponse(error, response, resolve, reject) {
        if (NodeErrorHandler.noError(error)) {
            if (new HttpResponseHandler(response.statusCode).success()) {
                resolve(response.body);
            } else {
                reject("unexpected response from the db");
            }
        } else {
            reject(error);
        }
    }

    static getAllDbs() {
        return new Promise((resolve, reject) => {
            request.get({
                "uri": ApplicationConfig.instance().dbUrl() + "/_all_dbs"
            },
            (error, response) => {
                if(NodeErrorHandler.noError(error)) {
                    if(response.statusCode === HttpResponseHandler.codes.OK) {
                        let userDbs = JSON.parse(response.body).filter(dbName => {
                            if(dbName !== "_replicator" && dbName !== "_users") {
                                return dbName;
                            }
                        });
                        resolve(userDbs);
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
