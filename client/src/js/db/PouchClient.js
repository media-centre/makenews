/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import DbSession from "./DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class PouchClient {
    static fetchDocuments(queryPath, options) {
        return new Promise((resolve, reject) => {
            DbSession.instance().query(queryPath, options).then(result => {
                let documents = result.rows.map((row) => {
                    return row.value;
                });
                resolve(documents);
            }).catch((error) => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    resolve([]);
                } else {
                    reject(error);
                }
            });
        });
    }

    static fetchLinkedDocuments(queryPath, options) {
        return new Promise((resolve, reject) => {
            DbSession.instance().query(queryPath, options).then(result => {
                resolve(result.rows);
            }).catch((error) => {
                if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                    resolve([]);
                } else {
                    reject(error);
                }
            });
        });
    }

    static createDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            DbSession.instance().post(jsonDocument).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static updateDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            DbSession.instance().put(jsonDocument).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static getDocument(id) {
        return new Promise((resolve, reject) => {
            DbSession.instance().get(id).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static deleteDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            if(jsonDocument) {
                DbSession.instance().remove(jsonDocument).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject("document can not be empty");
            }
        });
    }

    static createBulkDocuments(jsonDocument) {
        return new Promise((resolve, reject) => {
            DbSession.instance().bulkDocs(jsonDocument).then(response => {
                resolve(response);
            });
        });
    }
}
