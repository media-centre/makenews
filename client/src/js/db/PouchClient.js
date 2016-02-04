/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import DbSession from "./DbSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";

export default class PouchClient {
    static fetchDocuments(queryPath, options) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.query(queryPath, options).then(result => {
                    let documents = result.rows.map((row) => { //eslint-disable-line
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

            }).catch((error) => {
                reject(error);
            });
        });
    }

    static fetchLinkedDocuments(queryPath, options) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.query(queryPath, options).then(result => {
                    resolve(result.rows);
                }).catch((error) => {
                    if(error.status === HttpResponseHandler.codes.NOT_FOUND) {
                        resolve([]);
                    } else {
                        reject(error);
                    }
                });

            });
        });
    }

    static createDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.post(jsonDocument).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    static updateDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.put(jsonDocument).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    static getDocument(id) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.get(id).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    static bulkDocuments(jsonDocument, options = {}) {
        return new Promise((resolve, reject) => {
            DbSession.instance().then(session => {
                session.bulkDocs(jsonDocument, options).then(response => {
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    static deleteDocument(jsonDocument) {
        return new Promise((resolve, reject) => {
            if(jsonDocument) {
                DbSession.instance().then(session => {
                    session.remove(jsonDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            } else {
                reject("document can not be empty");
            }
        });
    }
}
