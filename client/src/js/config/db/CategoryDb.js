/* eslint no-underscore-dangle:0, no-unused-vars:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";

export default class CategoryDb {

    static fetchAllCategoryDocuments() {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true });
    }

    static fetchSourceConfigurationsByCategoryId(categoryId) {
        if(StringUtil.isEmptyString(categoryId)) {
            return new Promise((resolve, reject) => {
                reject("category id should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/sourceConfigurations", { "include_docs": true, "key": categoryId });
    }

    static fetchSourceConfigurationByUrl(url) {
        if(StringUtil.isEmptyString(url)) {
            return new Promise((resolve, reject) => {
                reject("url should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/allSourcesByUrl", { "include_docs": true, "key": url });
    }

    static createOrUpdateSource(sourceConfigurationDocument) {
        return new Promise((resolve, reject) => {
            if(!sourceConfigurationDocument) {
                reject("document should not be empty");
            }
            CategoryDb.fetchSourceConfigurationByUrl(sourceConfigurationDocument.url).then(docs => {
                if(docs.length === 0) {
                    PouchClient.createDocument(sourceConfigurationDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    let existingDocument = docs[0];
                    existingDocument.categoryIds.push(sourceConfigurationDocument.categoryIds[0]);
                    PouchClient.updateDocument(existingDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                }
            });
        });
    }
}
