/*eslint no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient";
import CategoryDb from "../config/db/CategoryDb";
import DateTimeUtil from "../utils/DateTimeUtil.js";

export const STATUS_VALID = "valid", STATUS_INVALID = "invalid";
export default class Source {
    constructor(paramsObj) {
        if(paramsObj._id) {
            this._id = paramsObj._id;
        }
        if(paramsObj._rev) {
            this._rev = paramsObj._rev;
        }
        this.docType = "source";
        this.sourceType = paramsObj.sourceType;
        this.url = paramsObj.url;
        this.categoryIds = paramsObj.categoryIds;
        this.status = paramsObj.status;
        this.latestFeedTimestamp = paramsObj.latestFeedTimestamp || DateTimeUtil.getUTCDateAndTime(Date.now());
    }

    static instance(paramsObj) {
        return new Source(paramsObj);
    }

    getDocument() {
        let docObj = {
            "docType": this.docType,
            "sourceType": this.sourceType,
            "url": this.url,
            "categoryIds": this.categoryIds,
            "status": this.status,
            "latestFeedTimestamp": this.latestFeedTimestamp
        };
        if(this._id) {
            docObj._id = this._id;
        }
        if(this._rev) {
            docObj._rev = this._rev;
        }
        return docObj;
    }

    save() {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchSourceConfigurationByUrl(this.url).then(docs => {
                let existingDocument = docs[0], NEGATIVE_INDEX = -1;
                if(existingDocument) {
                    if(existingDocument.categoryIds.indexOf(this.categoryIds[0]) === NEGATIVE_INDEX) {
                        existingDocument.categoryIds.push(this.categoryIds[0]);
                    }
                    this.update(existingDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    PouchClient.createDocument(this.getDocument()).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                }
            });
        });
    }

    update(updateParams) {
        return new Promise((resolve, reject) => {
            PouchClient.updateDocument(Object.assign({}, this.getDocument(), updateParams)).then(response => {
                resolve(response);
            }).catch(error => {
                reject(error);
            });
        });
    }

    delete(categoryId) {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(this._id).then(document => {
                const NEGATIVE_INDEX = -1;
                const foundIndex = document.categoryIds.indexOf(categoryId);
                if(foundIndex === NEGATIVE_INDEX) {
                    reject(false);
                } else if(document.categoryIds.length > 1) {
                    document.categoryIds.splice(foundIndex, 1);
                    updateDocument(document);
                } else {
                    deleteSourceWithReference(this._id);
                }
            }).catch(error => {
                reject(false);
            });

            function deleteSourceWithReference(sourceId) {
                CategoryDb.deleteSourceWithReference(sourceId).then(response => {
                    resolve(true);
                }).catch(error => {
                    reject(false);
                });

            }

            function updateDocument(document) {
                PouchClient.updateDocument(document).then(response => {
                    resolve(true);
                }).catch(error => {
                    reject(false);
                });
            }
        });
    }
}
