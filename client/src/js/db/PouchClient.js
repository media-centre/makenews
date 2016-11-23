/* eslint no-underscore-dangle:0, no-unused-vars:0 */


import DbSession from "./DbSession";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";

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

    static bulkDelete(documents, options = {}) {
        let deleteDocs = [];
        documents.forEach(document => {
            deleteDocs.push({
                "_id": document._id,
                "_rev": document._rev,
                "_deleted": true
            });
        });
        return PouchClient.bulkDocuments(deleteDocs, options);
    }

    static bulkDocuments(documents, options = {}) {
        return new Promise((resolve, reject) => {
            if(!documents || documents.length === 0) {                  //eslint-disable-line no-magic-numbers
                resolve("no documents, ignoring the action.");
            } else {
                DbSession.instance().then(session => {
                    session.bulkDocs(documents, options).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                });
            }
        });
    }

    static deleteDocument(document) {
        return new Promise((resolve, reject) => {
            if(document) {
                DbSession.instance().then(session => {
                    PouchClient.getDocument(document._id).then(latestDocument => {
                        let deletedDoc = {
                            "_id": latestDocument._id,
                            "_rev": latestDocument._rev,
                            "_deleted": true
                        };
                        PouchClient.updateDocument(deletedDoc).then(response => { //eslint-disable-line max-nested-callbacks
                            resolve(response);
                        }).catch(error => { //eslint-disable-line max-nested-callbacks
                            reject(error);
                        });
                    }).catch(docError => {
                        reject(docError);
                    });
                });
            } else {
                resolve("document is null. ignoring the deletion action.");
            }
        });
    }
}
