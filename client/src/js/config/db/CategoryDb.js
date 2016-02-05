/* eslint no-underscore-dangle:0, no-unused-vars:0, max-nested-callbacks:0, no-inline-comments:0, no-warning-comments:0 */

"use strict";
import PouchClient from "../../db/PouchClient.js";
import StringUtil from "../../../../../common/src/util/StringUtil.js";
import FeedApplicationQueries from "../../../js/feeds/db/FeedApplicationQueries";
import CategoriesApplicationQueries from "./CategoriesApplicationQueries";
import Source from "../Source";
import SourceDb from "../db/SourceDb.js";

export default class CategoryDb {

    static fetchAllCategoryDocuments() {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true });
    }

    static fetchCategoryById(categoryId) {
        return PouchClient.fetchDocuments("category/allCategories", { "include_docs": true, "key": categoryId });
    }

    static isCategoryExists(categoryName, categoryId) {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchAllCategoryDocuments().then(categories => {
                let isAlreadyExists = false;
                categories.some((category)=> {
                    if(((categoryId && category._id !== categoryId) || !categoryId) && categoryName.toLowerCase() === category.name.toLowerCase()) {
                        isAlreadyExists = true;
                        resolve({ "status": isAlreadyExists, "error": "" });
                        return;
                    }
                });
                if(!isAlreadyExists) {
                    resolve({ "status": isAlreadyExists });
                }
            }).catch(error => {
                reject({ "error": error, "status": false });
            });
        });
    }

    static fetchCategoryByName(name) {
        if(StringUtil.isEmptyString(name)) {
            return new Promise((resolve, reject) => {
                reject("name should not be empty");
            });
        }
        return PouchClient.fetchDocuments("category/allCategoriesByName", { "include_docs": true, "key": name });
    }

    static createCategoryIfNotExists(categoryDocument) {
        return new Promise((resolve, reject) => {
            if(!categoryDocument) {
                reject({ "status": "document should not be empty" });
            }
            CategoryDb.isCategoryExists(categoryDocument.name).then(result => {
                if(result.status === false) {
                    PouchClient.createDocument(categoryDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                }
                resolve({ "status": "category name already exists" });
            }).catch(error => {
                reject(error);
            });
        });
    }

    static createCategory(categoryDocument) {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchCategoryByName(categoryDocument.name).then(result => {
                if(result.length === 0) {
                    PouchClient.createDocument(categoryDocument).then(response => {
                        resolve(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    reject("Category with name already exists");
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

    static updateCategory(categoryDocument) {
        return new Promise((resolve, reject) => {
            PouchClient.updateDocument(categoryDocument).then(response => {
                resolve(response);
            }).catch(error => {
                reject({ "status": false, "error": error });
            });
        });
    }

    static deleteCategory(categoryId) {
        return new Promise((resolve, reject) => {
            SourceDb.fetchSourceConfigurationsByCategoryId(categoryId).then(sourceUrlsObj => {
                sourceUrlsObj.forEach((sourceUrlObj) => {
                    Source.instance(sourceUrlObj).delete(categoryId);
                });
                CategoryDb.deleteCategoryDocument(categoryId, resolve, reject);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    static deleteCategoryDocument(categoryId, resolve, reject) {
        PouchClient.getDocument(categoryId).then((document) => {
            PouchClient.deleteDocument(document).then(() => {
                resolve(true);
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    }

    static getCategoryById(categoryId) {
        return new Promise((resolve, reject) => {
            CategoryDb.fetchAllCategoryDocuments().then(categories => {
                categories.some((category)=> {
                    if(category._id === categoryId) {
                        resolve({ "status": true, "category": category });
                        return true;
                    }
                });
                resolve({ "status": false });
            }).catch(error => {
                reject({ "status": false, "error": error });
            });
        });
    }
}
