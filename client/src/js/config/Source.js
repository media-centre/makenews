/*eslint no-unused-vars:0 */
"use strict";
import PouchClient from "../db/PouchClient";
import CategoryDb from "../config/db/CategoryDb";

export default class Source {
    constructor(sourceId) {
        this.sourceId = sourceId;
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
