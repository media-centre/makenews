/*eslint no-unused-vars:0 */

"use strict";
import PouchClient from "../db/PouchClient";
import CategoryDb from "../config/db/CategoryDb";

export const STATUS_VALID = "valid", STATUS_INVALID = "invalid";
export default class Source {
    constructor(paramsObj) {
        this.sourceId = paramsObj.sourceId;
        this.docType = "source";
        this.sourceType = paramsObj.sourceType;
        this.url = paramsObj.url;
        this.categoryIds = paramsObj.categoryIds;
        this.status = paramsObj.status;
    }

    newDoc() {
        return {
            "docType": this.docType,
            "sourceType": this.sourceType,
            "url": this.url,
            "categoryIds": this.categoryIds,
            "status": this.status
        };
    }

    save() {
        return CategoryDb.createOrUpdateSource(this.newDoc());
    }

    delete(categoryId) {
        return new Promise((resolve, reject) => {
            PouchClient.getDocument(this.sourceId).then(document => {
                const NEGATIVE_INDEX = -1;
                const foundIndex = document.categoryIds.indexOf(categoryId);
                if(foundIndex === NEGATIVE_INDEX) {
                    reject(false);
                } else if(document.categoryIds.length > 1) {
                    document.categoryIds.splice(foundIndex, 1);
                    updateDocument(document);
                } else {
                    deleteSourceWithReference(this.sourceId);
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
