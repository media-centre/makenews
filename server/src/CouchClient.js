import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "./config/ApplicationConfig";
import { userDetails } from "./Factory";
import NodeErrorHandler from "./NodeErrorHandler";
import Logger, { logCategories } from "./logging/Logger";
import request from "request";

export default class CouchClient {
    static instance(accessToken, dbName, dbUrl = null) {
        return new CouchClient(accessToken, dbName, dbUrl);
    }

    async getUserName() {
        let response = await this.get("/_session");
        return response.userCtx.name;
    }

    static logger() {
        return Logger.instance(logCategories.DATABASE);
    }

    constructor(accessToken, dbName, dbUrl) {
        this.accessToken = accessToken;
        this.dbUrl = dbUrl || ApplicationConfig.instance().dbUrl();
        this.dbName = dbName || userDetails.getUser(accessToken).dbName;
    }

    static async createInstance(accessToken) {
        let instance = CouchClient.getDbInstance(accessToken);
        if (!instance) {
            instance = new CouchClient(null, accessToken);
            instance.dbName = await instance.getUserDbName();
        }
        return instance;
    }

    saveDocument(documentId, documentObj, customHeaders = {}) {
        const path = "/" + this.dbName + "/" + documentId;
        return this.put(path, documentObj, customHeaders);
    }

    async saveBulkDocuments(body, customHeaders = {}) {
        const path = "/" + this.dbName + "/_bulk_docs";
        return this.post(path, body, customHeaders);
    }

    getDocument(documentId, customHeaders = {}) {
        const path = "/" + this.dbName + "/" + documentId;
        return this.get(path, {}, customHeaders);
    }

    findDocuments(query, customHeaders = {}) {
        const path = "/" + this.dbName + "/_find";
        return this.post(path, query, customHeaders);
    }

    createIndex(indexDoc, customHeaders = {}) {
        const path = "/" + this.dbName + "/_index";
        return this.post(path, indexDoc, customHeaders);
    }

    post(path, body, customHeaders = {}) {
        return new Promise((resolve, reject) => {
            request.post({
                "uri": this.dbUrl + path,
                "headers": this._headers(customHeaders),
                "body": body,
                "json": true
            }, (error, response) => {
                this.handleResponse(error, response, resolve, reject);
            });
        });
    }

    put(path, body, customHeaders = {}) {
        return new Promise((resolve, reject) => {
            request.put({
                "uri": this.dbUrl + path,
                "headers": this._headers(customHeaders),
                "body": body || {},
                "json": true
            }, (error, response) => {
                this.handleResponse(error, response, resolve, reject);
            });
        });
    }

    get(path, data = {}, customHeaders = {}) {
        return new Promise((resolve, reject) => {
            request.get({
                "uri": this.dbUrl + path,
                "headers": this._headers(customHeaders),
                "data": data,
                "json": true
            }, (error, response) => {
                this.handleResponse(error, response, resolve, reject);
            });
        });
    }

    handleResponse(error, response, resolve, reject) {
        if (NodeErrorHandler.noError(error)) {
            if (new HttpResponseHandler(response.statusCode).success()) {
                CouchClient.logger().debug("CouchClient:: successful response from database.");
                resolve(response.body);
            } else if (response.statusCode === HttpResponseHandler.codes.CONFLICT) {
                reject({ "status": "conflict", "message": response.body });
            } else {
                CouchClient.logger().debug(`unexpected response from the db with status ${response.statusCode} and Error: ${JSON.stringify(response.body)}`);
                reject("unexpected response from the db");
            }
        } else {
            CouchClient.logger().debug(`Error from database. Error: ${JSON.stringify(error)}`);
            reject(error);
        }
    }

    static getAllDbs() {
        return new Promise((resolve, reject) => {
            request.get({
                "uri": ApplicationConfig.instance().dbUrl() + "/_all_dbs"
            },
                (error, response) => {
                    if (NodeErrorHandler.noError(error)) {
                        if (response.statusCode === HttpResponseHandler.codes.OK) {
                            let userDbs = JSON.parse(response.body).filter(dbName => dbName !== "_replicator" && dbName !== "_users");
                            CouchClient.logger().debug("CouchClient:: successful response from database.");
                            resolve(userDbs);
                        } else {
                            CouchClient.logger().debug("unexpected response from the db with status %s.", response.statusCode);
                            reject("unexpected response from the db");
                        }
                    } else {
                        CouchClient.logger().debug("Error from database. Error: %s", error);
                        reject(error);
                    }
                });
        });
    }


    _headers(customHeaders) {
        let headers = {};
        let defaultHeaders = this._defaultHeaders();
        for (let key in defaultHeaders) {
            if (defaultHeaders.hasOwnProperty(key)) {
                headers[key] = defaultHeaders[key];
            }
        }
        for (let key in customHeaders) {
            if (customHeaders.hasOwnProperty(key)) {
                headers[key] = customHeaders[key];
            }
        }
        return headers;
    }

    _defaultHeaders() {
        return {
            "Cookie": "AuthSession=" + this.accessToken,
            "Content-Type": "application/json",
            "Accept": "application/json"
        };
    }
}
