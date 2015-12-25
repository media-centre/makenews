"use strict";

import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../config/ApplicationConfig.js";
import CouchClient from "../CouchClient.js";

import request from "request";


export default class SchemaInfo {
    static instance(dbName, accessToken) {
        return new SchemaInfo(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }


    save(schemaVersion) {
        return new Promise((resolve, reject) => {
            let couchClient = CouchClient.instance(this.dbName, this.accessToken);
            this.getSchemaInfoDocument().then(schemaInfoDocument => {
                couchClient.saveDocument("schema_info", this._getDocument(schemaVersion, schemaInfoDocument)).then(response => { //eslint-disable-line no-unused-vars
                    resolve(true);
                    return;
                }).catch(error => { //eslint-disable-line no-unused-vars
                    reject(false);
                });
            }).catch(error => { //eslint-disable-line no-unused-vars
                reject(false);
            });
        });
    }

    getSchemaInfoDocument() {
        return new Promise((resolve, reject) => {

            request.get({
                "uri": ApplicationConfig.dbUrl() + "/" + this.dbName + "/schema_info",
                "headers": { "Cookie": "AuthSession=" + this.accessToken, "Accept": "application/json" }
            },
            (error, response) => {
                if(error) {
                    reject(error);
                } else {
                    if(response.statusCode === HttpResponseHandler.codes.OK) { //eslint-disable-line no-lonely-if
                        resolve(JSON.parse(response.body));
                    } else if(response.statusCode === HttpResponseHandler.codes.NOT_FOUND) {
                        resolve(null);
                    } else {
                        reject("unexpected response from the couchdb");
                    }
                }
            });
        });
    }

    _getDocument(schemaVersion, schemaInfoDocument) {
        if(!schemaInfoDocument) {
            return { "lastMigratedDocumentTimeStamp": schemaVersion };
        }
        schemaInfoDocument.lastMigratedDocumentTimeStamp = schemaVersion;
        return schemaInfoDocument;
    }
}
